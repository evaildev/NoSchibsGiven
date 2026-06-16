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

const errors = [];
const initiatorDomains = new Set();

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
