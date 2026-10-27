// NoSchibsGiven — DOM-cleanup som backup når nettverksblokkering ikke er nok.
// Strategi 1: SourcePoint/Schibsted blokkeres i rules.json (declarativeNetRequest)
// Strategi 2: Skjul og fjern gjenværende samtykke-UI i nettleseren
//
// GENERERT FIL — ikke rediger src/content.js direkte. Den bygges fra
// src/content.template.js av scripts/generate.mjs, og SCHIBSTED_ROOTS hentes
// fra src/config.json så domenelisten aldri kommer ut av sync.

(function () {
  const SCHIBSTED_ROOTS = ["tek.no","vg.no","bt.no","e24.no","aftenposten.no","ap.no","aftonbladet.se","omni.se","godt.no","side2.no","vgd.no","svd.se","aftenbladet.no","fvn.no"];

  const hostname = location.hostname;

  function isSchibstedSite() {
    return SCHIBSTED_ROOTS.some(
      (root) => hostname === root || hostname.endsWith('.' + root)
    );
  }

  const onSchibsted = isSchibstedSite();

  // Pause per side styres fra popupen. Bakgrunnsscriptet vet hvilken side
  // fanen viser, også når vi kjører i en iframe (f.eks. SourcePoint sin).
  // Til svaret kommer skjuler vi bare med CSS, som kan fjernes igjen. Elementer
  // slettes først når vi vet at siden ikke er pauset — ellers ville en popup
  // som rakk å dukke opp, vært borte selv om brukeren hadde pauset siden.
  let paused = false;
  const api = globalThis.browser ?? globalThis.chrome;
  const mayBePaused = onSchibsted || /privacy-mgmt\.com|sourcepoint\.com/.test(hostname);
  let pauseKnown = !mayBePaused;

  // SourcePoint-spesifikke selektorer — trygge på alle sider
  const SOURCEPOINT_CSS = `
    [id^="sp_message_container"],
    [id^="sp_message_iframe"],
    .sp_message_container,
    #sp_privacy_manager_container,
    #sp_privacy_manager,
    ._sp_overlay {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  // Ekstra Schibsted/CMP-selektorer — kun der vi vet det er trygt
  const SCHIBSTED_CSS = `
    #unified-gdpr,
    .message-overlay,
    [class*="ConsentBanner"],
    [class*="consent-banner"],
    [class*="CookieBanner"],
    [class*="cookie-banner"],
    [class*="gdpr-banner"],
    [class*="cmp-overlay"],
    [id*="cmp-container"] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    body.sp-lock,
    body.overflow-hidden,
    body.no-scroll,
    html.sp-lock {
      overflow: auto !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = onSchibsted
    ? SOURCEPOINT_CSS + SCHIBSTED_CSS
    : SOURCEPOINT_CSS;
  (document.head || document.documentElement).appendChild(style);

  function unlockScroll() {
    document.body?.classList.remove('sp-lock', 'overflow-hidden', 'no-scroll');
    if (document.body?.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
    document.documentElement?.classList.remove('sp-lock', 'overflow-hidden', 'no-scroll');
    if (document.documentElement?.style.overflow === 'hidden') {
      document.documentElement.style.overflow = '';
    }
  }

  // Bare SourcePoint sine egne navn. «sp_» alene treffer f.eks. wsp_header.
  function isSourcePointNode(node) {
    const id = node.id || '';
    return (
      id.startsWith('sp_message') ||
      id.startsWith('sp_privacy_manager') ||
      [...(node.classList ?? [])].some((c) => c.startsWith('sp_message') || c === '_sp_overlay')
    );
  }

  function isSchibstedCmpNode(node) {
    const id = node.id || '';
    const cls = typeof node.className === 'string' ? node.className : '';
    return (
      id.includes('unified-gdpr') ||
      id.includes('cmp-container') ||
      cls.includes('ConsentBanner') ||
      cls.includes('consent-banner') ||
      cls.includes('CookieBanner') ||
      cls.includes('cookie-banner') ||
      cls.includes('gdpr-banner') ||
      cls.includes('cmp-overlay')
    );
  }

  function shouldRemove(node) {
    if (paused || !pauseKnown) return false;
    if (isSourcePointNode(node)) return true;
    if (onSchibsted && isSchibstedCmpNode(node)) return true;
    return false;
  }

  function cleanDOM() {
    if (paused || !pauseKnown) return;
    const selectors = onSchibsted
      ? [
          '[id^="sp_message_container"]',
          '[id^="sp_message_iframe"]',
          '#unified-gdpr',
          '#sp_privacy_manager_container',
          '._sp_overlay',
          '.message-overlay',
          '[class*="cmp-overlay"]',
          '[id*="cmp-container"]',
        ]
      : [
          '[id^="sp_message_container"]',
          '[id^="sp_message_iframe"]',
          '#sp_privacy_manager_container',
          '._sp_overlay',
        ];

    let removed = 0;
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.remove();
        removed++;
      });
    });
    // Schibsted låser scrolling for popupen selv om den aldri vises. Andre
    // sider kan låse scrolling med vilje, der rører vi det bare hvis vi
    // faktisk fjernet en popup.
    if (onSchibsted || removed > 0) unlockScroll();
  }

  /**
   * SourcePoint lagrer samtykke i localStorage. Uten dette kan siden
   * forsøke å re-injisere popup selv om nettverkskall er blokkert.
   * Vi fjerner kun nøkler med kjent SourcePoint-prefiks (best-effort).
   */
  function neutralizeSourcePointStorage() {
    if (!onSchibsted || paused || !pauseKnown) return;
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('_sp_') || key.startsWith('sp.'))) {
          toRemove.push(key);
        }
      }
      toRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // localStorage kan være blokkert i noen kontekster (f.eks. privat modus)
    }
  }

  cleanDOM();

  // SourcePoint-nøkler fjernes først når vi vet at siden ikke er pauset,
  // ellers ville brukeren blitt spurt om samtykke på nytt ved hver lasting.
  if (mayBePaused) {
    new Promise((resolve) => resolve(api.runtime.sendMessage({ type: 'nsg:isPaused' })))
      .catch(() => null)
      .then((res) => {
        pauseKnown = true;
        if (res?.paused) {
          paused = true;
          style.remove();
          observer.disconnect();
        } else {
          // Rydd opp det CSS-en har skjult mens vi ventet.
          cleanDOM();
          neutralizeSourcePointStorage();
        }
      });
  } else {
    neutralizeSourcePointStorage();
  }

  document.addEventListener('DOMContentLoaded', () => {
    cleanDOM();
    neutralizeSourcePointStorage();
  });
  window.addEventListener('load', cleanDOM);

  /**
   * MutationObserver fanger popup-er som injiseres dynamisk etter page load.
   * Vi observerer kun nye noder — ikke hele DOM-treet på hver mutasjon.
   */
  const observer = new MutationObserver((mutations) => {
    let removed = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (shouldRemove(node)) {
          node.remove();
          removed = true;
        }
      }
    }
    if (removed) unlockScroll();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
