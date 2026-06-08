<p align="center">
  <img src="banner.png" alt="NoSchibsGiven" width="100%"/>
</p>

<p align="center">
  <em>No Schibsted-given consent popups. Ever.</em>
</p>

<p align="center">
  <a href="../../releases"><img src="https://img.shields.io/github/v/release/evaildev/NoSchibsGiven?style=flat-square&color=e63946&label=Latest release" alt="Release"/></a>
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="MV3"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT"/>
</p>

---

Schibsted krever betaling for å avvise annonsesporing — [Forbrukertilsynet mener det er ulovlig](https://www.forbrukertilsynet.no). Denne utvidelsen blokkerer popup-en helt, på alle nettsider som bruker SourcePoint som CMP.

## Nedlasting

Gå til **[Releases](../../releases)** og last ned riktig pakke:

| Nettleser | Fil |
|-----------|-----|
| Chrome, Edge, Opera, Brave, Vivaldi | `noschibsgiven-chromium-vX.X.zip` |
| Firefox | `noschibsgiven-firefox-vX.X.zip` |
| Safari | Se [instruksjoner nedenfor](#safari) |

## Installasjon

### Chrome / Edge / Opera / Brave / Vivaldi

1. Pakk ut ZIP-filen
2. Åpne `chrome://extensions/`
3. Skru på **Developer mode** øverst til høyre
4. Klikk **Load unpacked** → velg den utpakkede mappen

### Firefox

1. Pakk ut ZIP-filen
2. Åpne `about:debugging` → **This Firefox**
3. Klikk **Load Temporary Add-on** → velg `manifest.json`

> For permanent installasjon: bruk Firefox Developer Edition og sett `xpinstall.signatures.required = false` i `about:config`.

### Safari

Krever macOS og Xcode:

```bash
xcrun safari-web-extension-converter dist/build-chromium \
  --project-location safari-src \
  --app-name NoSchibsGiven
```

Bygg i Xcode og aktiver under Safari → Innstillinger → Utvidelser.

## Hvordan det fungerer

To lag med beskyttelse:

- **Nettverksblokkering** — `declarativeNetRequest` blokkerer `cdn.privacy-mgmt.com` og `sourcepoint.com` før de laster inn
- **DOM-cleanup** — content script fjerner eventuelle gjenværende elementer via MutationObserver

## Bygg selv

```bash
git clone https://github.com/evaildev/NoSchibsGiven
cd NoSchibsGiven
bash build.sh
```

## Lisens

MIT
