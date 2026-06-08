![NoSchibsGiven](banner.png)

# NoSchibsGiven

> *No Schibsted-given consent popups. Ever.*

Blokkerer Schibsted sin cookie-popup som krever betaling for å avvise annonsering.  
[Forbrukertilsynet mener denne praksisen er ulovlig.](https://www.forbrukertilsynet.no)

Fungerer på **alle** nettsider som bruker SourcePoint som CMP — ikke bare Schibsted.

---

## Støttede nettlesere

| Nettleser | Pakke |
|-----------|-------|
| Chrome | `noschibsgiven-chromium-vX.X.zip` |
| Edge | `noschibsgiven-chromium-vX.X.zip` |
| Opera | `noschibsgiven-chromium-vX.X.zip` |
| Brave | `noschibsgiven-chromium-vX.X.zip` |
| Vivaldi | `noschibsgiven-chromium-vX.X.zip` |
| Firefox | `noschibsgiven-firefox-vX.X.zip` |
| Safari | Se [Safari-instruksjoner](#safari) |

---

## Nedlasting

Gå til [Releases](../../releases) og last ned riktig ZIP for din nettleser.

---

## Installasjon

### Chrome / Edge / Opera / Brave / Vivaldi

1. Last ned og pakk ut `noschibsgiven-chromium-vX.X.zip`
2. Åpne `chrome://extensions/` (eller `edge://extensions/` osv.)
3. Skru på **Developer mode** (øverst til høyre)
4. Klikk **Load unpacked** → velg den utpakkede mappen
5. Ferdig ✅

### Firefox

1. Last ned og pakk ut `noschibsgiven-firefox-vX.X.zip`
2. Åpne `about:debugging` → **This Firefox**
3. Klikk **Load Temporary Add-on**
4. Velg `manifest.json` inne i den utpakkede mappen
5. Ferdig ✅

> **Merk:** Midlertidig installasjon forsvinner når Firefox lukkes.  
> For permanent installasjon uten signering: bruk Firefox Developer Edition eller Nightly,  
> og sett `xpinstall.signatures.required = false` i `about:config`.

### Safari

Safari krever macOS og Xcode for konvertering. Kjør:

```bash
xcrun safari-web-extension-converter dist/build-chromium \
  --project-location safari-src \
  --app-name NoSchibsGiven
```

Åpne prosjektet i Xcode, bygg og installer.  
Aktiver deretter under Safari → Innstillinger → Utvidelser.

---

## Hvordan det fungerer

To lag med beskyttelse:

1. **Nettverksblokkering** — Blokkerer `cdn.privacy-mgmt.com` og `sourcepoint.com` på nettverksnivå via `declarativeNetRequest`. SourcePoint-scriptet laster aldri inn.
2. **DOM-cleanup** — Content script kjører ved sidestart og fjerner eventuelle gjenværende overlay-elementer via MutationObserver. Backup i tilfelle SP serveres fra annen URL.

---

## Bygg selv

```bash
git clone https://github.com/ditt-brukernavn/NoSchibsGiven
cd NoSchibsGiven
bash build.sh
# Pakker ligger i dist/
```

---

## Lisens

MIT
