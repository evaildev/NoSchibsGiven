<p align="center">
  <img src="banner.png" alt="NoSchibsGiven" width="100%"/>
</p>

<p align="center">
  <em>Personvern er ikke et abonnement.</em>
</p>

<p align="center">
  <a href="../../releases"><img src="https://img.shields.io/github/v/release/evaildev/NoSchibsGiven?style=flat-square&color=e63946&label=Last versjon" alt="Release"/></a>
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="MV3"/>
  <img src="https://img.shields.io/badge/Lisens-MIT-green?style=flat-square" alt="MIT"/>
</p>

---

## Hvorfor?

Klarte ikke å dy meg da Schibsted fant ut at det var en glimrende idé å kreve løsepenger for at vi skal få lov til å takke nei til sporing. Jeg har ingenting imot å betale for ting, men jeg nekter faen meg å betale for å ikke bli overvåket.

Så her er en extension som dreper hele driten før den rekker å laste. Det var genuint mindre tiltak å kode en egen extension enn å finne frem bankkortet. Vær så god.

— evaildev

Schibsted krever opptil 49 kr/md for å avvise annonsesporing. Datatilsynet og Forbrukerrådet mener det bryter med GDPR. Denne utvidelsen blokkerer popup-en helt — gratis, for alle.

> *«Personvern er en menneskerett som man ikke skal måtte betale for.»*  
> — Line Coll, direktør i Datatilsynet

🔗 [Datatilsynet: Schibsted tek betalt for personvern](https://www.datatilsynet.no/aktuelt/aktuelle-nyheter-2026/schibsted-tek-betalt-for-personvern/) *(april 2026)*  
🔗 [Forbrukerrådet klager inn Schibsted til Datatilsynet](https://rett24.no/articles/forbrukerradet-klager-schibsted-inn-til-datatilsynet-for-betaling-for-personvern) *(juni 2026)*  
🔗 [Datatilsynet åpner tilsyn med Schibsted](https://www.digi.no/artikler/datatilsynet-apner-tilsyn-med-schibsted/573703) *(juni 2026)*  
🔗 [Schibsted-sjefen tar selvkritikk: «Kommunikasjonen kunne vært bedre»](https://www.kom24.no/annonsevalg-datatilsynet-kommunikasjon/schibsted-sjefen-tar-selvkritikk-kommunikasjonen-kunne-vaert-bedre/936849) *(juli 2026)*  
🔗 [Staten reagerer på Schibsted-grep](https://www.kampanje.com/medier/staten-reagerer-pa-schibsted-grep/1016504) — departementenes DSS mener det er urimelig at ansatte må betale *(juli 2026)*  
🔗 [Schibsted ba Datatilsynet dempe kritikken](https://www.nettavisen.no/schibsted/datatilsynet/personvern/schibsted-ba-datatilsynet-dempe-kritikken/s/5-95-3208094) — over 300 tips og 52 klager *(august 2026)*

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

> Vil du bidra til å lage en offisiell Safari-versjon? Se [Bidra](#-bidra) nedenfor.

---

## 🧩 Popup

Klikk på ikonet i verktøylinja for å se:

- **Teller** — hvor mange forespørsler som er blokkert på siden du står på, delt i samtykke-popup, sporing og annonse-SDK-er. Tallet vises også som badge på ikonet.
- **Pause på denne siden** — skrur av utvidelsen for én Schibsted-side (f.eks. hvis innlogging eller betaling ikke virker). Siden lastes på nytt med alt slått av, og pausen gjelder til du skrur den av igjen.
- **Klag til Datatilsynet** — kopierer en ferdig klagetekst og åpner klagesiden til Datatilsynet.
- **Meld nytt domene** — åpner issue-malen med siden fylt inn.

> I Firefox teller utvidelsen blokkerte forespørsler selv, siden nettleseren mangler API-et Chrome bruker. Derfor ber Firefox-versjonen også om tillatelsen `webRequest`. Den brukes bare til å telle, ikke til å lese eller endre innhold.

## 🛡️ Hvordan det fungerer

Utvidelsen bruker tre lag med beskyttelse:

1. **Nettverksblokkering** — Blokkerer på nettverksnivå:
   - SourcePoint sine servere (`cdn.privacy-mgmt.com`) — popup-scriptet laster aldri inn
   - Schibsted sitt eget CMP (`cmp.tek.no`, `cmp.vg.no`, osv.)
   - Schibsted tracking og analytics (`sdk.pulse.schibsted.com`, `static.privacy.schibsted.com`, `ads.inventory.schibsted.io`)
   - Tredjeparts sporing og annonse-SDK-er (Datadog, Azure ad SDK, Microsoft Ads, Kantar `log.medietall.no`) — **kun** på Schibsted Media-sider
   - AppNexus (`adnxs`) blokkeres **ikke**: uten samtykke kan den bare vise kontekstuelle annonser, og blokkering ga 3–4 sekunders forsinkelse på VGTV
2. **DOM-cleanup** — Et backup-script fjerner eventuelle gjenværende samtykke-elementer automatisk når siden lastes. På Schibsted-sider ryddes også `localStorage`-nøkler som SourcePoint bruker til å huske samtykke.
3. **TCF-stub** — På Schibsted-sider svarer utvidelsen på spillerens samtykke-spørringer (`__tcfapi`) med «GDPR gjelder, ingen samtykke gitt». Uten dette ville videospillere (f.eks. VGTV) henge fordi de venter på et svar fra den blokkerte CMP-en.

SourcePoint-blokkeringen fungerer på **alle** nettsider som bruker SourcePoint som CMP. Schibsted-spesifikk tracking-blokkering gjelder Schibsted Media-sider:

`tek.no` · `vg.no` · `bt.no` · `ba.no` · `e24.no` · `aftenposten.no` · `ap.no` · `aftonbladet.se` · `omni.se` · `hbl.fi` · `dn.no` · `godt.no` · `side2.no` · `vgd.no` · `svd.se`

### Hva utvidelsen ikke blokkerer

- Serverside logging (HTTP access logs, CDN-logger)
- Tracking på andre nettsider enn Schibsted Media
- **finn.no** (egen plattform, ikke dekket)

### Kjente begrensninger

- **Schibsted Plus / betaling:** Domener som `session-service.payment.schibsted.no` blokkeres fordi de brukes til sporing. Dette kan i noen tilfeller påvirke innloggings- eller betalingsflyt. Bruk **Pause på denne siden** i popupen hvis det skjer, og rapporter gjerne problemet.
- **Firefox:** Midlertidig installasjon krever manuell lasting ved hver oppstart (se installasjonssteg over).

Fant du et nytt tracking-domene? Bruk [issue-malen for nye domener](../../issues/new?template=nytt-domene.md) eller åpne en vanlig [Issue](../../issues).

---

## 🛠️ Utvikling

Krever [Node.js](https://nodejs.org/) 18+.

```bash
# Generer rules.json og manifest fra src/config.json
npm run generate

# Valider at regler og host_permissions er konsistente
npm run validate

# Bygg ZIP-pakker til dist/
npm run build
```

**Filstruktur:**

| Fil | Formål |
|-----|--------|
| `src/config.json` | Domener og blokkeringslister (én kilde) |
| `src/content.template.js` | Mal for DOM-cleanup — rediger denne |
| `src/content.js` | **Generert** fra malen + config (ikke rediger direkte) |
| `src/inject.js` | TCF-stub som kjører i sidens MAIN-verden (fikser videospillere) |
| `src/background.js` | Registrerer TCF-stubben, håndterer pause per side og badge-teller |
| `src/popup.html` / `popup.js` / `popup.css` | Popupen i verktøylinja |
| `src/sites.js` | **Generert** domeneliste som deles av background og popup |
| `scripts/generate.mjs` | Genererer `rules.json`, `content.js`, `sites.js` og manifester |
| `scripts/validate.mjs` | Sjekker konsistens før build |
| `scripts/build.mjs` | Pakker Chromium- og Firefox-ZIP |

For å legge til et nytt domene: oppdater **kun** `src/config.json`, kjør `npm run build`, og test på siden. Domenelisten i `content.js` genereres automatisk fra config, så den holdes alltid i sync.

Endringslogg: se [CHANGELOG.md](CHANGELOG.md).

---

## 🤝 Bidra

Innspill, feilmeldinger og pull requests er velkomne!  
Åpne en [Issue](../../issues) eller send e-post til **evail@protonmail.com**

Vil du hjelpe med Safari-versjon? Ta kontakt — det trengs noen med Mac og Xcode.

---

## 📄 Lisens

MIT
