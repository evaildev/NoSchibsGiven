// NoSchibsGiven — bakgrunnsscript.
//
// - Registrerer TCF-stubben (inject.js) dynamisk i stedet for i manifestet,
//   slik at den kan ekskluderes på sider brukeren har pauset.
// - Pause per side: en dynamisk DNR-regel (allowAllRequests) med høyere
//   prioritet enn blokkeringsreglene slipper gjennom alt fra den siden.
// - Svarer content.js på om fanen sin side er pauset.
// - Viser antall blokkerte forespørsler som badge på ikonet (kun Chromium).

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

api.runtime.onInstalled.addListener(() => {
  setupBadge();
  sync();
});
api.runtime.onStartup.addListener(sync);

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

  return false;
});
