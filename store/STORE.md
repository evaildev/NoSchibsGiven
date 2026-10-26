# Butikktekster

Tekster og bilder til Chrome Web Store, Firefox Add-ons (AMO) og Edge Add-ons.

## Felles

**Navn:** NoSchibsGiven

**Kort beskrivelse** (Chrome maks 132 tegn, AMO maks 250):

> Blokkerer Schibsted sin betalte samtykke-popup og sporingen bak den. Personvern er ikke et abonnement.

**Kategori:** Personvern og sikkerhet (Chrome: *Privacy & Security*, AMO: *Privacy & Security*)

**Språk:** Norsk (bokmål)

**Nettside:** https://github.com/evaildev/NoSchibsGiven

**Support:** https://github.com/evaildev/NoSchibsGiven/issues eller evail@protonmail.com

**Personvernerklæring:** https://github.com/evaildev/NoSchibsGiven/blob/master/PRIVACY.md

**Bilder:** `icon-128.png` (ikon), `1-blokkert.png`, `2-teller.png`, `3-pause.png` (1280×800) og `promo-440x280.png` (liten promo-flis i Chrome)

## Lang beskrivelse

```
Schibsted vil ha opptil 49 kr i måneden for at du skal få takke nei til personlig tilpasset reklame. Datatilsynet og Forbrukerrådet mener det bryter med personvernreglene. Denne utvidelsen sier nei for deg, gratis.

Hva den gjør:
• Blokkerer samtykke-popupen (SourcePoint og Schibsted sin egen) før den lastes
• Blokkerer Schibsted sin sporing og måling (Pulse, Kantar m.fl.) og tredjeparts annonse-SDK-er på Schibsted-sider
• Svarer «ingen samtykke» til videospillere, så de ikke henger
• Rydder bort rester av samtykke-popupen hvis noe slipper gjennom

I popupen:
• Teller: se hvor mange forespørsler som er blokkert på siden du står på, og hvor de skulle
• Pause på denne siden: virker ikke innlogging eller betaling? Skru av utvidelsen for én side
• Klag til Datatilsynet: kopierer en ferdig klagetekst og åpner klagesiden
• Meld nytt domene: fant du sporing vi ikke blokkerer? Si fra på GitHub

Virker på Schibsted sine nettaviser i Norge og Sverige. Hele listen over sider står på GitHub.

Utvidelsen samler ikke inn noe om deg, og sender ingenting noe sted. All kode er åpen på GitHub.

Utvidelsen er laget av en privatperson og har ingen tilknytning til Schibsted.
```

## Chrome Web Store: personvernfanen

**Enkelt formål (single purpose):**

> Blokkere Schibsted sin samtykke-popup og sporing på Schibsted sine nettaviser, slik at brukeren slipper å betale for å takke nei til sporing.

**Begrunnelse for tillatelser:**

| Tillatelse | Begrunnelse |
|---|---|
| `declarativeNetRequest` | Blokkerer samtykke-popupen og sporingsskript på nettverksnivå med statiske regler. Ingen forespørsler leses eller endres utover å blokkeres. |
| `scripting` | Registrerer et lite script som svarer «ingen samtykke gitt» på samtykke-API-et (`__tcfapi`) på Schibsted-sider. Uten det henger videospillerne fordi de venter på svar fra den blokkerte popupen. Registreres dynamisk så det kan skrus av for sider brukeren har pauset. |
| `storage` | Husker hvilke sider brukeren har pauset. Lagres bare lokalt. |
| `activeTab` | Lar popupen hente antall blokkerte forespørsler (`getMatchedRules`) for fanen brukeren står på når de klikker på ikonet. |
| Vertstillatelser / innholdsscript | Innholdsscriptet fjerner rester av samtykke-popupen hvis noe slipper gjennom nettverksblokkeringen. SourcePoint brukes av mange nettsider, så det kjører på alle sider, men gjør bare noe der det finner SourcePoint sine elementer. På Schibsted-sider sletter det også SourcePoint sine samtykkenøkler i localStorage. Vertstillatelsene for Schibsted- og sporingsdomenene trengs for at blokkeringen og TCF-scriptet skal virke der. |

**Ekstern kode (remote code):** Nei. All kode ligger i pakken.

**Databruk:** Kryss av for at utvidelsen *ikke* samler inn noen av kategoriene. Bekreft alle tre erklæringene (selger ikke data, bruker ikke data til annet enn formålet, bruker ikke data til kredittvurdering).

## Firefox Add-ons (AMO)

**Lisens:** MIT

**Kildekode:** Ikke nødvendig. Koden er verken minifisert eller transpilert. `content.js`, `rules.json`, `sites.js` og manifestet genereres fra `src/config.json`, men er lesbare som de er.

**Notat til anmelder:**

```
Source: https://github.com/evaildev/NoSchibsGiven

content.js, rules.json, sites.js and manifest.json are generated from src/config.json by scripts/generate.mjs (plain Node, no dependencies). To rebuild: npm run build (Node 20.15+ or 22.2+). Output is identical to the uploaded ZIP.

webRequest is only used to count requests blocked by declarativeNetRequest (onErrorOccurred with NS_ERROR_ABORT), because Firefox does not support declarativeNetRequest.getMatchedRules. It never blocks, reads bodies or modifies requests.

The extension collects no data (data_collection_permissions: none).
```

## Edge Add-ons

Samme ZIP og tekster som Chrome. Edge spør også etter personvernerklæring og kategori.
