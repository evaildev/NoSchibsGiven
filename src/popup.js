// NoSchibsGiven — popup: teller, pause per side, klage og domenemelding.

const api = globalThis.browser ?? globalThis.chrome;
const { roots: ROOTS, repo: REPO } = globalThis.NSG_SITES;

const DATATILSYNET_URL =
  'https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/klage-til-datatilsynet/';

const CATEGORIES = [
  { key: 'popup', label: 'Samtykke-popup' },
  { key: 'tracking', label: 'Sporing og måling' },
  { key: 'ads', label: 'Annonse-SDK-er' },
];

const $ = (id) => document.getElementById(id);

function categoryFor(filter) {
  if (/^cmp\.|privacy-mgmt|sourcepoint|static\.privacy\.schibsted|\/consents/.test(filter)) {
    return 'popup';
  }
  if (/^ads\.|adsdk|advert/i.test(filter)) return 'ads';
  return 'tracking';
}

function rootFor(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  return ROOTS.find((root) => host === root || host.endsWith('.' + root)) ?? null;
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

// ?tab=<id> lar popupen åpnes som egen fane for feilsøking.
async function currentTab() {
  const forced = Number(new URLSearchParams(location.search).get('tab'));
  if (forced) return api.tabs.get(forced);
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function showToast(text) {
  const toast = $('toast');
  toast.textContent = text;
  toast.hidden = false;
}

async function renderCounts(tab) {
  if (typeof api.declarativeNetRequest.getMatchedRules !== 'function') {
    $('count').textContent = '–';
    $('counter-note').textContent = 'Telleren støttes ikke i denne nettleseren.';
    $('counter-note').hidden = false;
    return;
  }

  let matched;
  let rules;
  try {
    [matched, rules] = await Promise.all([
      api.declarativeNetRequest.getMatchedRules({ tabId: tab.id }),
      fetch(api.runtime.getURL('rules.json')).then((res) => res.json()),
    ]);
  } catch {
    $('counter-note').textContent = 'Klarte ikke å hente telleren. Prøv igjen om litt.';
    $('counter-note').hidden = false;
    return;
  }

  const filterById = new Map(rules.map((rule) => [rule.id, rule.condition.urlFilter]));
  const counts = { popup: 0, tracking: 0, ads: 0 };
  const filters = new Map();

  for (const info of matched.rulesMatchedInfo) {
    if (info.rule.rulesetId !== 'ruleset_1') continue;
    const filter = filterById.get(info.rule.ruleId);
    if (!filter) continue;
    counts[categoryFor(filter)]++;
    filters.set(filter, (filters.get(filter) ?? 0) + 1);
  }

  const total = counts.popup + counts.tracking + counts.ads;
  $('count').textContent = String(total);

  const list = $('categories');
  list.replaceChildren(
    ...CATEGORIES.map(({ key, label }) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      const value = document.createElement('span');
      name.textContent = label;
      value.textContent = String(counts[key]);
      li.append(name, value);
      return li;
    })
  );

  if (filters.size > 0) {
    $('filters').replaceChildren(
      ...[...filters.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([filter, n]) => {
          const li = document.createElement('li');
          li.textContent = `${filter} (${n})`;
          return li;
        })
    );
    $('details').hidden = false;
  }
}

async function renderPause(tab, root) {
  if (!root) {
    $('pause-note').hidden = false;
    return;
  }

  const { paused = [] } = await api.storage.local.get('paused');
  const isPaused = paused.includes(root);

  $('pause-site').textContent = root;
  $('pause').checked = isPaused;
  $('pause-row').hidden = false;
  setStatus(isPaused);

  $('pause').addEventListener('change', async (event) => {
    const value = event.target.checked;
    const res = await api.runtime.sendMessage({ type: 'nsg:setPaused', root, paused: value });
    if (!res?.ok) {
      event.target.checked = !value;
      showToast('Klarte ikke å endre pause. Prøv igjen.');
      return;
    }
    setStatus(value);
    await api.tabs.reload(tab.id);
    window.close();
  });
}

function setStatus(isPaused) {
  const status = $('status');
  status.textContent = isPaused ? 'Pauset' : 'Aktiv';
  status.classList.toggle('paused', isPaused);
}

function complaintText(site) {
  const where = site ? ` på ${site}` : '';
  return [
    `Jeg vil klage på Schibsted Media AS sin ordning «Schibsted annonsevalg»${where}.`,
    '',
    'For å takke nei til personlig tilpasset annonsering må jeg betale 39–49 kr i måneden. ' +
      'Jeg mener at samtykket da ikke er frivillig, slik personvernforordningen artikkel 4 nr. 11 ' +
      'og artikkel 7 nr. 4 krever, og at personvern ikke skal være noe man må kjøpe seg fri fra.',
    '',
    'Jeg ber Datatilsynet vurdere ordningen i den pågående tilsynssaken.',
  ].join('\n');
}

async function main() {
  $('version').textContent = `v${api.runtime.getManifest().version}`;

  const tab = await currentTab();
  const site = hostOf(tab?.url ?? '');
  const root = rootFor(tab?.url ?? '');

  $('counter-label').textContent = site ? `Blokkert på ${site}` : 'Blokkert på denne siden';

  $('complain').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(complaintText(root));
      showToast('Klagetekst kopiert. Lim den inn i skjemaet.');
    } catch {
      // Utklippstavlen kan være utilgjengelig, siden åpnes uansett
    }
    api.tabs.create({ url: DATATILSYNET_URL });
  });

  $('report').addEventListener('click', () => {
    const url = new URL(`${REPO}/issues/new`);
    url.searchParams.set('template', 'nytt-domene.md');
    url.searchParams.set('title', `[Domene] ${site || ''}`.trim());
    api.tabs.create({ url: url.toString() });
  });

  if (!tab) return;
  await Promise.all([renderCounts(tab), renderPause(tab, root)]);
}

main();
