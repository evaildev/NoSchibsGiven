// NoSchibsGiven — bakgrunnsscript.
//
// - Registrerer TCF-stubben (inject.js) dynamisk i stedet for i manifestet,
//   slik at den kan ekskluderes på sider brukeren har pauset.
// - Pause per side: en dynamisk DNR-regel (allowAllRequests) med høyere
//   prioritet enn blokkeringsreglene slipper gjennom alt fra den siden.
// - Svarer content.js på om fanen sin side er pauset.
// - Viser antall blokkerte forespørsler som badge på ikonet. Chromium teller
//   selv, i Firefox teller vi via webRequest (se under).

if (typeof importScripts === 'function' && !globalThis.NSG_SITES) {
  importScripts('sites.js');
}

const api = globalThis.browser ?? globalThis.chrome;
const ROOTS = globalThis.NSG_SITES.roots;
const INJECT_ID = 'nsg-tcf-stub';
const PAUSE_RULE_BASE = 10000;

function rootFor(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  return ROOTS.find((root) => host === root || host.endsWith('.' + root)) ?? null;
}

const patternsFor = (root) => [`*://${root}/*`, `*://*.${root}/*`];

async function getPaused() {
  const { paused = [] } = await api.storage.local.get('paused');
  return paused.filter((root) => ROOTS.includes(root));
}

async function syncPauseRules(paused) {
  const existing = await api.declarativeNetRequest.getDynamicRules();
  await api.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules: paused.map((root, i) => ({
      id: PAUSE_RULE_BASE + i,
      priority: 100,
      action: { type: 'allowAllRequests' },
      condition: { requestDomains: [root], resourceTypes: ['main_frame', 'sub_frame'] },
    })),
  });
}

// TCF-stubben må kjøre i sidens MAIN-verden på document_start, før VG sin
// egen __tcfapi-stub. Den registreres på nytt ved hver endring fordi
// excludeMatches ikke kan fjernes med updateContentScripts.
async function syncInjectScript(paused) {
  const script = {
    id: INJECT_ID,
    js: ['inject.js'],
    matches: ROOTS.flatMap(patternsFor),
    runAt: 'document_start',
    allFrames: true,
    world: 'MAIN',
    persistAcrossSessions: true,
  };
  if (paused.length > 0) {
    script.excludeMatches = paused.flatMap(patternsFor);
  }

  const registered = await api.scripting.getRegisteredContentScripts({ ids: [INJECT_ID] });
  if (registered.length > 0) {
    await api.scripting.unregisterContentScripts({ ids: [INJECT_ID] });
  }
  await api.scripting.registerContentScripts([script]);
}

async function sync() {
  const paused = await getPaused();
  await Promise.all([syncPauseRules(paused), syncInjectScript(paused)]);
}

async function setPaused(root, value) {
  const paused = new Set(await getPaused());
  if (value) {
    paused.add(root);
  } else {
    paused.delete(root);
  }
  await api.storage.local.set({ paused: [...paused] });
  await sync();
}

function setupBadge() {
  try {
    api.declarativeNetRequest.setExtensionActionOptions?.({ displayActionCountAsBadgeText: true });
    api.action.setBadgeBackgroundColor({ color: '#e63946' });
  } catch {
    // Firefox støtter ikke action count-badge
  }
}

// --- Teller i Firefox -----------------------------------------------------
// Firefox mangler declarativeNetRequest.getMatchedRules. Der teller vi i
// stedet forespørsler som feiler med NS_ERROR_ABORT og matcher en av reglene
// våre (det er feilen Firefox gir når DNR blokkerer). Tellingen ligger i
// storage.session fordi bakgrunnssiden avsluttes når den er inaktiv.

const COUNTS_KEY = 'tabCounts';
const useWebRequestCounter =
  typeof api.declarativeNetRequest.getMatchedRules !== 'function' &&
  Boolean(api.webRequest?.onErrorOccurred);

let rulesPromise = null;
function loadRules() {
  rulesPromise ??= fetch(api.runtime.getURL('rules.json'))
    .then((res) => res.json())
    .then((rules) =>
      rules.map((rule) => {
        const filter = rule.condition.urlFilter;
        const host = filter.match(/^\|\|(.+)\^$/)?.[1] ?? null;
        return {
          filter: host ?? filter,
          host: host?.toLowerCase() ?? null,
          needle: filter.toLowerCase(),
          initiators: rule.condition.initiatorDomains ?? null,
          types: rule.condition.resourceTypes,
        };
      })
    );
  return rulesPromise;
}

const hostIn = (host, domains) => domains.some((d) => host === d || host.endsWith('.' + d));

// webRequest-typer som DNR kjenner under et annet navn.
const DNR_TYPE = { beacon: 'ping', imageset: 'image' };

// Samme logikk som DNR: ||vert^ treffer verten og dens subdomener, urlFilter
// uten ankere er en delstreng av URL-en (uavhengig av store/små bokstaver),
// og initiatorDomains gjelder dokumentet.
function matchRule(rules, details) {
  const url = details.url.toLowerCase();
  let host = '';
  try {
    host = new URL(details.url).hostname;
  } catch {
    // ugyldig URL
  }
  const type = DNR_TYPE[details.type] ?? details.type;
  let initiator = '';
  try {
    initiator = new URL(details.documentUrl ?? details.originUrl ?? '').hostname;
  } catch {
    // forespørsel uten dokument
  }
  return rules.find(
    (rule) =>
      (rule.host ? hostIn(host, [rule.host]) : url.includes(rule.needle)) &&
      rule.types.includes(type) &&
      (!rule.initiators || hostIn(initiator, rule.initiators))
  );
}

// Firefox sin forhåndslaster ber om script og bilder før parseren når dem.
// Blir forhåndslastingen blokkert, prøver parseren på nytt med en ny
// forespørsel, så samme ressurs gir to feil. Chromium teller den én gang,
// så vi teller hver URL av disse typene bare én gang per sidelasting.
const PRELOAD_TYPES = new Set(['script', 'image', 'imageset']);
const seenPreloadable = new Map(); // tabId -> Set(url)

let countsPromise = null;
const getCounts = () =>
  (countsPromise ??= api.storage.session.get(COUNTS_KEY).then((s) => s[COUNTS_KEY] ?? {}));

let saveTimer = null;
function scheduleSave(counts) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => api.storage.session.set({ [COUNTS_KEY]: counts }), 250);
}

if (useWebRequestCounter) {
  api.webRequest.onErrorOccurred.addListener(
    async (details) => {
      if (details.tabId < 0 || details.error !== 'NS_ERROR_ABORT') return;
      const rule = matchRule(await loadRules(), details);
      if (!rule) return;

      if (PRELOAD_TYPES.has(details.type)) {
        let seen = seenPreloadable.get(details.tabId);
        if (!seen) seenPreloadable.set(details.tabId, (seen = new Set()));
        if (seen.has(details.url)) return;
        seen.add(details.url);
      }

      const counts = await getCounts();
      const tab = (counts[details.tabId] ??= {});
      tab[rule.filter] = (tab[rule.filter] ?? 0) + 1;
      scheduleSave(counts);

      const total = Object.values(tab).reduce((sum, n) => sum + n, 0);
      api.action.setBadgeText({ tabId: details.tabId, text: String(total) });
    },
    { urls: ['<all_urls>'] }
  );

  // Ny sidelasting i fanen nullstiller telleren, slik Chromium gjør.
  api.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status !== 'loading') return;
    seenPreloadable.delete(tabId);
    const counts = await getCounts();
    if (counts[tabId]) {
      delete counts[tabId];
      scheduleSave(counts);
    }
    api.action.setBadgeText({ tabId, text: '' });
  });

  api.tabs.onRemoved.addListener(async (tabId) => {
    seenPreloadable.delete(tabId);
    const counts = await getCounts();
    if (counts[tabId]) {
      delete counts[tabId];
      scheduleSave(counts);
    }
  });
}

api.runtime.onInstalled.addListener(() => {
  setupBadge();
  sync();
});
api.runtime.onStartup.addListener(() => {
  setupBadge();
  sync();
});

api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'nsg:isPaused') {
    const root = rootFor(sender.tab?.url ?? '');
    if (!root) {
      sendResponse({ paused: false });
      return false;
    }
    getPaused().then((paused) => sendResponse({ paused: paused.includes(root) }));
    return true;
  }

  // Kun utvidelsens egne sider (popup) får endre pause-status.
  const fromExtension = (sender.url ?? '').startsWith(api.runtime.getURL(''));
  if (msg?.type === 'nsg:setPaused' && fromExtension && ROOTS.includes(msg.root)) {
    setPaused(msg.root, Boolean(msg.paused)).then(
      () => sendResponse({ ok: true }),
      (err) => sendResponse({ ok: false, error: String(err) })
    );
    return true;
  }

  if (msg?.type === 'nsg:getCounts' && fromExtension && useWebRequestCounter) {
    getCounts().then((counts) => sendResponse({ filters: counts[msg.tabId] ?? {} }));
    return true;
  }

  return false;
});
