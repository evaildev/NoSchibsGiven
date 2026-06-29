#!/usr/bin/env node
/**
 * Kryssplattform-build: pakker Chromium- og Firefox-ZIP til dist/
 */

import { cpSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { platform } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const version = JSON.parse(readFileSync(join(SRC, 'config.json'), 'utf8')).version;

function zipDirectory(sourceDir, zipPath) {
  rmSync(zipPath, { force: true });

  if (platform() === 'win32') {
    const escapedSrc = sourceDir.replace(/'/g, "''");
    const escapedZip = zipPath.replace(/'/g, "''");
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${escapedSrc}\\*' -DestinationPath '${escapedZip}' -Force"`,
      { stdio: 'inherit' }
    );
  } else {
    execSync(`cd "${sourceDir}" && zip -rq "${zipPath}" .`, { stdio: 'inherit' });
  }
}

function buildBrowser(name, manifestFile, zipName) {
  const out = join(DIST, `build-${name}`);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(join(out, 'icons'), { recursive: true });

  cpSync(join(SRC, 'content.js'), join(out, 'content.js'));
  cpSync(join(SRC, 'inject.js'), join(out, 'inject.js'));
  cpSync(join(SRC, 'rules.json'), join(out, 'rules.json'));
  cpSync(join(SRC, manifestFile), join(out, 'manifest.json'));
  cpSync(join(SRC, 'icons', 'icon16.png'), join(out, 'icons', 'icon16.png'));
  cpSync(join(SRC, 'icons', 'icon32.png'), join(out, 'icons', 'icon32.png'));
  cpSync(join(SRC, 'icons', 'icon48.png'), join(out, 'icons', 'icon48.png'));
  cpSync(join(SRC, 'icons', 'icon128.png'), join(out, 'icons', 'icon128.png'));

  const zipPath = join(DIST, zipName);
  zipDirectory(out, zipPath);
  rmSync(out, { recursive: true, force: true });

  console.log(`✅  ${name}: ${zipPath}`);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

buildBrowser('chromium', 'manifest.chromium.json', `noschibsgiven-chromium-v${version}.zip`);
buildBrowser('firefox', 'manifest.firefox.json', `noschibsgiven-firefox-v${version}.zip`);

console.log('\nFerdig! Filer i dist/');
