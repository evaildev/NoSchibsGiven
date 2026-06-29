#!/usr/bin/env node
/**
 * Genererer rules.json og manifest-filer fra src/config.json.
 * Én kilde for domener og blokkeringslister — unngår copy-paste-feil.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

const config = JSON.parse(readFileSync(join(SRC, 'config.json'), 'utf8'));

const schibstedDomains = [
  ...config.schibstedRoots,
  ...config.schibstedExtraHosts,
];

const cmpHosts = config.schibstedRoots.map((root) => `cmp.${root}`);

function buildInitiatorDomains() {
  return [...new Set(schibstedDomains)].sort();
}

function buildRules() {
  const initiatorDomains = buildInitiatorDomains();
  const resourceTypes = config.resourceTypes;
  const rules = [];
  let id = 1;

  const addRule = (urlFilter, extra = {}) => {
    rules.push({
      id: id++,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter,
        resourceTypes,
        ...extra,
      },
    });
  };

  for (const filter of config.globalUrlFilters) {
    addRule(filter);
  }

  for (const host of cmpHosts) {
    addRule(host);
  }

  for (const filter of config.scopedUrlFilters) {
    addRule(filter, { initiatorDomains });
  }

  return rules;
}

function urlFilterToHostPermissions(filter) {
  // Sti- og scriptnavn-filtre (f.eks. /consents, getPulseTracker) treffer
  // førsteparts-URL-er på Schibsted — dekket av initiator-domener.
  if (filter.startsWith('/') || !filter.includes('.')) {
    return [];
  }

  // Kun ekte vertsnavn — ikke tilfeldige URL-strenger med punktum i seg.
  const hostnameRe = /^[a-z0-9]([a-z0-9-]*\.)+[a-z]{2,}$/i;
  if (!hostnameRe.test(filter)) {
    return [];
  }

  const dotCount = (filter.match(/\./g) || []).length;

  if (dotCount === 1) {
    // domene.tld — tillat alle subdomener (f.eks. *.sourcepoint.com)
    return [`*://*.${filter}/*`];
  }

  // Fullt vertsnavn (f.eks. cdn.privacy-mgmt.com, ads.inventory.schibsted.io)
  return [`*://${filter}/*`];
}

function buildHostPermissions() {
  const perms = new Set();

  for (const filter of [...config.globalUrlFilters, ...config.scopedUrlFilters]) {
    for (const perm of urlFilterToHostPermissions(filter)) {
      perms.add(perm);
    }
  }

  for (const host of cmpHosts) {
    perms.add(`*://${host}/*`);
  }

  for (const root of config.schibstedRoots) {
    perms.add(`*://${root}/*`);
    perms.add(`*://*.${root}/*`);
  }

  for (const host of config.schibstedExtraHosts) {
    perms.add(`*://${host}/*`);
  }

  return [...perms].sort();
}

function buildContentScriptMatches() {
  const matches = new Set(['*://*/*']);

  for (const root of config.schibstedRoots) {
    matches.add(`*://${root}/*`);
    matches.add(`*://*.${root}/*`);
  }

  return [...matches].sort();
}

function buildContentScript() {
  const template = readFileSync(join(SRC, 'content.template.js'), 'utf8');
  // Hardkod domenelisten fra config.json så content.js aldri kommer ut av sync.
  const rootsLiteral = JSON.stringify(config.schibstedRoots);
  if (!template.includes('__SCHIBSTED_ROOTS__')) {
    throw new Error('content.template.js mangler placeholder __SCHIBSTED_ROOTS__');
  }
  return template.replaceAll('__SCHIBSTED_ROOTS__', rootsLiteral);
}

function buildManifest(browser) {
  const base = {
    manifest_version: 3,
    name: 'NoSchibsGiven',
    version: config.version,
    description:
      'Blokkerer Schibsted sin betalte samtykke-popup og all client-side sporing på Schibsted Media-sider.',
    permissions: ['declarativeNetRequest'],
    host_permissions: buildHostPermissions(),
    declarative_net_request: {
      rule_resources: [
        {
          id: 'ruleset_1',
          enabled: true,
          path: 'rules.json',
        },
      ],
    },
    content_scripts: [
      {
        matches: buildContentScriptMatches(),
        js: ['content.js'],
        run_at: 'document_start',
        all_frames: true,
      },
    ],
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
  };

  if (browser === 'firefox') {
    base.browser_specific_settings = {
      gecko: {
        id: 'schibsted-blocker@local',
        strict_min_version: '113.0',
      },
    };
  }

  return base;
}

const rules = buildRules();
writeFileSync(join(SRC, 'rules.json'), `${JSON.stringify(rules, null, 2)}\n`);

writeFileSync(join(SRC, 'content.js'), buildContentScript());

writeFileSync(
  join(SRC, 'manifest.chromium.json'),
  `${JSON.stringify(buildManifest('chromium'), null, 2)}\n`
);

writeFileSync(
  join(SRC, 'manifest.firefox.json'),
  `${JSON.stringify(buildManifest('firefox'), null, 2)}\n`
);

writeFileSync(
  join(ROOT, 'package.json'),
  `${JSON.stringify(
    {
      name: 'noschibsgiven',
      version: config.version,
      description:
        'Blokkerer Schibsted/SourcePoint samtykke-popups og client-side sporing på Schibsted Media-sider',
      private: true,
      type: 'module',
      scripts: {
        generate: 'node scripts/generate.mjs',
        validate: 'node scripts/validate.mjs',
        build: 'node scripts/build.mjs',
        prebuild: 'npm run generate && npm run validate',
      },
    },
    null,
    2
  )}\n`
);

console.log(`Generert ${rules.length} DNR-regler, content.js, manifester og package.json (v${config.version})`);
