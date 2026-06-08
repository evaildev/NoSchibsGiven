<p align="center">
  <img src="banner.png" alt="NoSchibsGiven" width="100%"/>
</p>

<p align="center">
  <em>No Schibsted-given consent popups. Ever.</em>
</p>

<p align="center">
  <a href="../../releases"><img src="https://img.shields.io/github/v/release/evaildev/NoSchibsGiven?style=flat-square&color=e63946&label=Last versjon" alt="Release"/></a>
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="MV3"/>
  <img src="https://img.shields.io/badge/Lisens-MIT-green?style=flat-square" alt="MIT"/>
</p>

---

Schibsted krever opptil 49 kr/md for å avvise annonsesporing. Datatilsynet og Forbrukerrådet mener det bryter med GDPR. Denne utvidelsen blokkerer popup-en helt — gratis, for alle.

> *«Personvern er en menneskerett som man ikke skal måtte betale for.»*  
> — Line Coll, direktør i Datatilsynet

🔗 [Datatilsynet: Schibsted tek betalt for personvern](https://www.datatilsynet.no/aktuelt/aktuelle-nyheter-2026/schibsted-tek-betalt-for-personvern/) *(april 2026)*  
🔗 [Forbrukerrådet klager inn Schibsted til Datatilsynet](https://rett24.no/articles/forbrukerradet-klager-schibsted-inn-til-datatilsynet-for-betaling-for-personvern) *(juni 2026)*

---

## 📥 Nedlasting

Gå til **[Releases](../../releases)** og last ned riktig fil for din nettleser:

| Nettleser | Fil |
|-----------|-----|
| Chrome | `noschibsgiven-chromium-vX.X.zip` |
| Edge | `noschibsgiven-chromium-vX.X.zip` |
| Opera | `noschibsgiven-chromium-vX.X.zip` |
| Brave | `noschibsgiven-chromium-vX.X.zip` |
| Vivaldi | `noschibsgiven-chromium-vX.X.zip` |
| Firefox | `noschibsgiven-firefox-vX.X.zip` |
| Safari | [Se nedenfor ↓](#-safari) |

---

## 🔧 Installasjon

### Chrome

1. Last ned `noschibsgiven-chromium-vX.X.zip` og pakk den ut (høyreklikk → *Pakk ut alle*)
2. Åpne Chrome og gå til `chrome://extensions/`
3. Skru på **Utviklermodus** øverst til høyre
4. Klikk **Last inn upakket** og velg mappen du pakket ut
5. Ferdig — utvidelsen er aktiv ✅

### Edge

1. Last ned og pakk ut `noschibsgiven-chromium-vX.X.zip`
2. Åpne Edge og gå til `edge://extensions/`
3. Skru på **Utviklermodus** nederst til venstre
4. Klikk **Last inn upakket** og velg mappen
5. Ferdig ✅

### Opera

1. Last ned og pakk ut `noschibsgiven-chromium-vX.X.zip`
2. Åpne Opera og gå til `opera://extensions/`
3. Skru på **Utviklermodus** øverst til høyre
4. Klikk **Last inn upakket** og velg mappen
5. Ferdig ✅

### Brave

1. Last ned og pakk ut `noschibsgiven-chromium-vX.X.zip`
2. Åpne Brave og gå til `brave://extensions/`
3. Skru på **Utviklermodus** øverst til høyre
4. Klikk **Last inn upakket** og velg mappen
5. Ferdig ✅

### Vivaldi

1. Last ned og pakk ut `noschibsgiven-chromium-vX.X.zip`
2. Åpne Vivaldi og gå til `vivaldi://extensions/`
3. Skru på **Utviklermodus** øverst til høyre
4. Klikk **Last inn upakket** og velg mappen
5. Ferdig ✅

### Firefox

1. Last ned og pakk ut `noschibsgiven-firefox-vX.X.zip`
2. Åpne Firefox og gå til `about:debugging`
3. Klikk **This Firefox** i menyen til venstre
4. Klikk **Load Temporary Add-on...**
5. Gå inn i mappen du pakket ut og velg filen `manifest.json`
6. Ferdig ✅

> ⚠️ **Merk:** Midlertidig installasjon forsvinner når Firefox lukkes. For permanent installasjon uten signering, bruk [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/) og sett `xpinstall.signatures.required` til `false` i `about:config`.

### 🍎 Safari

Safari støtter dessverre ikke direkte installasjon av utvidelser fra ZIP-filer slik som Chrome og Firefox gjør. Installasjon på Safari krever Xcode og er beregnet på utviklere.

**Alternativ for Mac-brukere:** Vi anbefaler å bruke [Chrome for Mac](https://www.google.com/chrome/) som er gratis og støtter enkel installasjon via stegene over.

> Vil du bidra til å lage en offisiell Safari-versjon? Se [Contributing](#-bidra) nedenfor.

---

## 🛡️ Hvordan det fungerer

Utvidelsen bruker to lag med beskyttelse:

1. **Nettverksblokkering** — Blokkerer SourcePoint sine servere (`cdn.privacy-mgmt.com`) på nettverksnivå. Popup-scriptet laster aldri inn.
2. **DOM-cleanup** — Et backup-script fjerner eventuelle gjenværende elementer automatisk når siden lastes.

Fungerer på **alle** nettsider som bruker SourcePoint som CMP — ikke bare Schibsted.

---

## 🤝 Bidra

Innspill, feilmeldinger og pull requests er velkomne!  
Åpne en [Issue](../../issues) eller send e-post til **evail@protonmail.com**

Vil du hjelpe med Safari-versjon? Ta kontakt — det trengs noen med Mac og Xcode.

---

## 📄 Lisens

MIT
