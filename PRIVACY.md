# Personvernerklæring for NoSchibsGiven

Sist oppdatert: 16. oktober 2026

Kort fortalt: NoSchibsGiven samler ikke inn noe om deg. Ingenting sendes til meg eller til noen andre.

## Hva utvidelsen lagrer

Alt lagres lokalt i nettleseren din:

- **Sider du har pauset.** Hvis du bruker «Pause på denne siden», lagres domenet (f.eks. `vg.no`) slik at pausen huskes. Du fjerner den ved å skru pausen av igjen, eller ved å avinstallere utvidelsen.
- **Telleren (kun Firefox).** Antall blokkerte forespørsler per fane lagres midlertidig så popupen kan vise det. Tellingen slettes når du laster siden på nytt, lukker fanen eller lukker nettleseren.

Utvidelsen lagrer ikke hvilke sider du besøker, hva du leser eller noe annet om deg.

## Hva utvidelsen sender

Ingenting. Utvidelsen har ingen server, ingen analyse og ingen sporing. Den gjør ingen nettverkskall på egen hånd.

Knappene i popupen åpner vanlige nettsider når du klikker på dem:

- **Klag til Datatilsynet** åpner Datatilsynets klageside og kopierer en klagetekst til utklippstavlen din.
- **Meld nytt domene** åpner et skjema på GitHub med siden du står på fylt inn. Ingenting sendes før du selv sender skjemaet.

## Tillatelser

- **declarativeNetRequest:** blokkerer samtykke-popupen og sporing før den lastes.
- **scripting:** legger inn scriptet som svarer «ingen samtykke» til videospillere, så de ikke henger.
- **storage:** husker hvilke sider du har pauset.
- **activeTab:** lar popupen telle blokkerte forespørsler på fanen du står på (Chrome, Edge osv.).
- **webRequest (kun Firefox):** brukes bare til å telle blokkerte forespørsler, siden Firefox mangler funksjonen Chrome bruker. Innhold blir ikke lest eller endret.
- **Tilgang til nettsider:** trengs for å blokkere sporing og fjerne rester av samtykke-popupen. På Schibsted-sider sletter utvidelsen også nøklene SourcePoint bruker for å huske samtykke.

## Kildekode

All kode er åpen: https://github.com/evaildev/NoSchibsGiven

## Kontakt

Spørsmål? Send e-post til evail@protonmail.com eller åpne en issue på GitHub.
