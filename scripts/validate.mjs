#!/usr/bin/env node
/**
 * Validerer at genererte filer er konsistente før build.
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

const config = JSON.parse(readFileSync(join(SRC, 'config.json'), 'utf8'));
const rules = JSON.parse(readFileSync(join(SRC, 'rules.json'), 'utf8'));
const chromium = JSON.parse(readFileSync(join(SRC, 'manifest.chromium.json'), 'utf8'));
const contentJs = readFileSync(join(SRC, 'content.js'), 'utf8');

const errors = [];

// content.js genereres fra content.template.js. Sjekk at SCHIBSTED_ROOTS er i
// sync med config.json — ellers er den generert på nytt med en utdatert template.
const rootsMatch = contentJs.match(/const SCHIBSTED_ROOTS = (\[[^\]]*\]);/);
if (!rootsMatch) {
  errors.push('content.js mangler generert SCHIBSTED_ROOTS — kjør npm run generate');
} else {
  let contentRoots = [];
  try {
    contentRoots = JSON.parse(rootsMatch[1]);
  } catch {
    errors.push('content.js: SCHIBSTED_ROOTS er ikke gyldig JSON');
  }
  const expected = JSON.stringify(config.schibstedRoots);
  if (JSON.stringify(contentRoots) !== expected) {
    errors.push('content.js: SCHIBSTED_ROOTS matcher ikke config.json — kjør npm run generate');
  }
}
if (contentJs.includes('__SCHIBSTED_ROOTS__')) {
  errors.push('content.js inneholder ubehandlet placeholder __SCHIBSTED_ROOTS__');
}
const initiatorDomains = new Set();

// Firefox/Chrome match pattern for host_permissions
const HOST_PERM_RE =
  /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$/;

for (const perm of chromium.host_permissions) {
  if (!HOST_PERM_RE.test(perm)) {
    errors.push(`ugyldig host_permission: ${perm}`);
  }
}

for (const rule of rules) {
  if (rule.condition?.initiatorDomains) {
    for (const domain of rule.condition.initiatorDomains) {
      initiatorDomains.add(domain);
    }
  }
}

const ids = rules.map((r) => r.id);
if (new Set(ids).size !== ids.length) {
  errors.push('rules.json: duplikate regel-IDer');
}

if (ids.length > 0 && Math.max(...ids) !== ids.length) {
  errors.push('rules.json: regel-IDer er ikke sekvensielle');
}

for (const domain of initiatorDomains) {
  const covered = chromium.host_permissions.some((perm) => {
    const bare = perm.replace(/^\*:\/\//, '').replace(/\/\*$/, '');
    if (bare.startsWith('*.')) {
      const suffix = bare.slice(2);
      return domain === suffix || domain.endsWith(`.${suffix}`);
    }
    return domain === bare || perm.includes(domain);
  });

  if (!covered) {
    errors.push(`manifest mangler host_permission for initiator-domene: ${domain}`);
  }
}

if (chromium.version !== config.version) {
  errors.push(`manifest-versjon (${chromium.version}) matcher ikke config (${config.version})`);
}

if (errors.length > 0) {
  console.error('Validering feilet:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`Validering OK: ${rules.length} regler, ${chromium.host_permissions.length} host_permissions`);
