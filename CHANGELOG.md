# Changelog

Alle vesentlige endringer i dette prosjektet dokumenteres her.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/nb/1.1.0/).

## [3.0.1] - 2026-10-16

### Fikset
- Telleren i popupen virker nå i Firefox. Firefox mangler `declarativeNetRequest.getMatchedRules`, så `background.js` teller i stedet forespørsler som blokkeres (`webRequest.onErrorOccurred` med `NS_ERROR_ABORT` som matcher en av reglene). Tellingen lagres per fane i `storage.session`, nullstilles ved ny sidelasting og vises som badge på ikonet
- Firefox sin forhåndslaster ber om blokkerte script og bilder to ganger. Disse telles én gang per sidelasting, slik at tallet blir det samme som i Chrome
- DOM-cleanup kunne ødelegge andre nettsider enn Schibsted sine: den fjernet scroll-lås (`overflow-hidden`, `no-scroll`) på alle sider ved lasting, og fjernet elementer med «sp_» i klassenavnet (f.eks. `wsp_header`) eller klassen `.message-overlay`. Utenfor Schibsted rører den nå bare SourcePoint sine egne elementer, og låser bare opp scrolling når den faktisk har fjernet en popup

### Lagt til
- Stavanger Aftenblad (`aftenbladet.no`) og Fædrelandsvennen (`fvn.no`). Fædrelandsvennen eies av Polaris Media, men bruker Schibsted sin plattform (Pulse, innlogging og betaling)

### Fjernet
- `dn.no` (DN Media), `ba.no` (Amedia) og `hbl.fi` (KSF Media/Bonnier). Ingen av dem eies av Schibsted

### Endret
- Firefox-versjonen ber om tillatelsen `webRequest` (kun for telleren). Chromium-versjonen er uendret
- Ny Firefox-ID (`noschibsgiven@evaildev`) og `data_collection_permissions` som forberedelse til addons.mozilla.org. Har du installert utvidelsen permanent i Firefox Developer Edition, må du fjerne den gamle før du installerer denne
- Personvernerklæring i `PRIVACY.md`

## [3.0.0] - 2026-10-16

### Lagt til
- Popup i verktøylinja med teller for blokkerte forespørsler på siden du står på (samtykke-popup, sporing, annonse-SDK-er) og liste over domenene. Antallet vises også som badge på ikonet (Chromium)
- **Pause på denne siden**: skrur av all blokkering, DOM-cleanup og TCF-stubben for én Schibsted-side, f.eks. når innlogging eller betaling ikke virker
- **Klag til Datatilsynet**: kopierer en ferdig klagetekst og åpner klagesiden
- **Meld nytt domene**: åpner issue-malen med siden fylt inn
- `background.js` og generert `sites.js`

### Endret
- TCF-stubben (`inject.js`) registreres nå dynamisk av `background.js` med `scripting.registerContentScripts`, slik at den kan ekskluderes på pausede sider
- Nye tillatelser: `scripting`, `storage` og `activeTab`. Telleren bruker `activeTab`, så utvidelsen trenger ikke `declarativeNetRequestFeedback`
- Validering sjekker background, popup og at `sites.js` er i sync med config

## [2.3.3] - 2026-10-16

### Lagt til
- Blokkering av Pulse sine innsamlingsendepunkter: `dc.schibsted.io`, `ncis.schibsted.com`, `cis.schibsted.com`, `collector.schibsted.io` og `sdkconfig.pulse.schibsted.io`. Pulse-SDK-en var allerede blokkert, men tek.no lastet fortsatt Pulse-konfigen som peker hit. Dette er ekstra sikring hvis Schibsted endrer hvor SDK-en lastes fra

## [2.3.2] - 2026-10-16

### Fikset
- Kantar sitt måledomene `log.medietall.no` ble ikke blokkert fordi config inneholdt feilstavede varianter (`log.medieretall.no`, `log.mediafall.no`, `log.medier24.no`) som ikke finnes i DNS. Erstattet med riktig domene, scoped til Schibsted-sider

### Endret
- README beskriver nå at AppNexus (`adnxs`) bevisst ikke blokkeres (se 2.3.0-oppfølging)
- README oppdatert med nye saker om Schibsted annonsevalg (juli–august 2026)

## [2.3.1] - 2026-07-29

### Fikset
- ZIP-pakkene ble bygget med backslash som stiseparator på Windows, slik at `icons`-mappen ikke ble pakket ut riktig. Arkivene bygges nå med `/` uansett plattform

## [2.3.0] - 2026-06-29

### Lagt til
- TCF-stub (`src/inject.js`) som kjører i sidens MAIN-verden på Schibsted-domener og svarer på spillerens `__tcfapi`-spørringer med «GDPR gjelder, ingen samtykke gitt». Fikser at VGTV-videoer ikke kunne startes når CMP-en var blokkert ([#1](../../issues/1))
- `LICENSE`-fil (MIT) — tidligere kun referert i README
- CI attacher nå `dist/*.zip` automatisk til GitHub Release når en release publiseres

### Endret
- `content.js` genereres nå fra `src/content.template.js` med domenelisten injisert fra `config.json` — `SCHIBSTED_ROOTS` kan ikke lenger komme ut av sync med config
- Validering sjekker at `content.js` sin domeneliste matcher `config.json`, og at TCF-stubben er registrert som en `world: "MAIN"`-content-script
- Firefox `strict_min_version` hevet til `128.0` (kreves for `world: "MAIN"` i content scripts)

## [2.2.1] - 2026-06-16

### Fikset
- Ugyldige `host_permissions` i Firefox (f.eks. `*://*InitialiseAdverts/*`) — generatoren lager nå kun gyldige match patterns
- Validering sjekker at alle host_permissions følger Firefox/Chrome sitt mønster

## [2.2.0] - 2026-06-16

### Lagt til
- Sentral `src/config.json` som kilde for domener og blokkeringslister
- Node.js build (`npm run build`) som fungerer på Windows, macOS og Linux
- Automatisk generering av `rules.json` og manifest-filer fra config
- Validering som sjekker at `host_permissions` dekker alle `initiatorDomains`
- GitHub Actions workflow for build og validering ved push/PR
- Issue-mal for rapportering av nye tracking-domener
- Støtte for flere Schibsted-sider: `dn.no`, `godt.no`, `side2.no`, `vgd.no`, `ap.no`, `svd.se`
- `all_frames: true` for å fange CMP-popups i iframes
- Best-effort opprydding av SourcePoint `localStorage`-nøkler på Schibsted-sider

### Endret
- `host_permissions` utvidet til alle Schibsted Media-domener (fikser at scoped tracking-regler ikke slo inn)
- Content script begrenser aggressiv DOM-fjerning til Schibsted-sider; andre sider får kun SourcePoint-backup
- MutationObserver bruker spesifikke selektorer i stedet for brede `consent`/`gdpr`-treff
- README oppdatert med utviklerinstruksjoner og kjente begrensninger

### Fjernet
- Avhengighet av bash/`zip` for bygg (beholdt `build.sh` som alternativ)

## [2.1.2] - 2026

### Lagt til
- Blokkering av vg.no-tracking og forsteparts Pulse-scripts

## [2.1.1] - 2026

### Lagt til
- Flere Schibsted-tracking-domener observert på tek.no

## [2.1.0] - 2026

### Lagt til
- Schibsted-tracking i tillegg til SourcePoint-popup

## [2.0.0] - 2026

### Lagt til
- Første release med nettverksblokkering og DOM-cleanup

[2.3.0]: https://github.com/evaildev/NoSchibsGiven/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/evaildev/NoSchibsGiven/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/evaildev/NoSchibsGiven/compare/v2.1.2...v2.2.0
[2.1.2]: https://github.com/evaildev/NoSchibsGiven/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/evaildev/NoSchibsGiven/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/evaildev/NoSchibsGiven/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/evaildev/NoSchibsGiven/releases/tag/v2.0.0
