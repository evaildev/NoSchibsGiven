# Changelog

Alle vesentlige endringer i dette prosjektet dokumenteres her.

Formatet er basert på [Keep a Changelog](https://keepachangelog.com/nb/1.1.0/).

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
