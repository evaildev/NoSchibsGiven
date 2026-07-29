#!/usr/bin/env node
/**
 * Kryssplattform-build: pakker Chromium- og Firefox-ZIP til dist/
 *
 * ZIP-arkivene bygges manuelt i stedet for å skalle ut til
 * Compress-Archive/zip. Begge disse (og til og med .NETs egen
 * ZipFile.CreateFromDirectory) skriver filstier med `\` som
 * separator når de kjøres på Windows, noe som bryter ZIP-spesen
 * (den krever `/`). Resultatet er at unzip-verktøy ikke lager en
 * egen "icons"-mappe, men i stedet en enkelt fil kalt "icons\navn.png".
 * Ved å skrive ZIP-formatet selv sikrer vi `/` som separator uansett
 * hvilken plattform bygget kjører på.
 */

import { readdirSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync, crc32 } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const version = JSON.parse(readFileSync(join(SRC, 'config.json'), 'utf8')).version;

function listFilesRecursive(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listFilesRecursive(full));
    } else {
      result.push(full);
    }
  }
  return result;
}

// Minimal ZIP-writer (store + deflate) som alltid bruker `/` som
// stiseparator, uavhengig av OS. Se kommentar øverst i filen for hvorfor.
function createZip(sourceDir, zipPath) {
  const files = listFilesRecursive(sourceDir);
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const filePath of files) {
    const entryName = relative(sourceDir, filePath).split(sep).join('/');
    const data = readFileSync(filePath);
    const crc = crc32(data) >>> 0;
    const compressed = deflateRawSync(data);
    const useDeflate = compressed.length < data.length;
    const payload = useDeflate ? compressed : data;
    const method = useDeflate ? 8 : 0;
    const nameBuf = Buffer.from(entryName, 'utf8');

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0x21, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(payload.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localChunks.push(localHeader, nameBuf, payload);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0x21, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(payload.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralChunks.push(centralHeader, nameBuf);

    offset += localHeader.length + nameBuf.length + payload.length;
  }

  const centralDirStart = offset;
  const centralDir = Buffer.concat(centralChunks);
  const centralDirSize = centralDir.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirStart, 16);
  eocd.writeUInt16LE(0, 20);

  rmSync(zipPath, { force: true });
  writeFileSync(zipPath, Buffer.concat([...localChunks, centralDir, eocd]));
}

function buildBrowser(name, manifestFile, zipName) {
  const out = join(DIST, `build-${name}`);
  rmSync(out, { recursive: true, force: true });
  mkdirSync(join(out, 'icons'), { recursive: true });

  const files = [
    ['content.js', 'content.js'],
    ['inject.js', 'inject.js'],
    ['rules.json', 'rules.json'],
    [manifestFile, 'manifest.json'],
    [join('icons', 'icon16.png'), join('icons', 'icon16.png')],
    [join('icons', 'icon32.png'), join('icons', 'icon32.png')],
    [join('icons', 'icon48.png'), join('icons', 'icon48.png')],
    [join('icons', 'icon128.png'), join('icons', 'icon128.png')],
  ];

  for (const [src, dest] of files) {
    const destPath = join(out, dest);
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, readFileSync(join(SRC, src)));
  }

  const zipPath = join(DIST, zipName);
  createZip(out, zipPath);
  rmSync(out, { recursive: true, force: true });

  console.log(`✅  ${name}: ${zipPath}`);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

buildBrowser('chromium', 'manifest.chromium.json', `noschibsgiven-chromium-v${version}.zip`);
buildBrowser('firefox', 'manifest.firefox.json', `noschibsgiven-firefox-v${version}.zip`);

console.log('\nFerdig! Filer i dist/');
