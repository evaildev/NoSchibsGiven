// NoSchibsGiven
// Strategi 1: SourcePoint og Schibsted-tracking blokkeres på nettverksnivå (rules.json)
// Strategi 2: DOM-cleanup som backup dersom samtykke-UI laster fra annen URL

(function () {
  // Injiser CSS umiddelbart — før DOM er ferdig
  const style = document.createElement('style');
  style.textContent = `
    [id^="sp_message_container"],
    [id^="sp_message_iframe"],
    .sp_message_container,
    #unified-gdpr,
    #sp_privacy_manager_container,
    #sp_privacy_manager,
    [class*="ConsentBanner"],
    [class*="consent-banner"],
    [class*="CookieBanner"],
    [class*="cookie-banner"],
    [class*="gdpr-banner"],
    [class*="cmp-overlay"],
    [id*="cmp-container"],
    [id*="didomi"],
    [id*="onetrust-banner"],
    .message-overlay,
    ._sp_overlay {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    body.sp-lock,
    body.overflow-hidden,
    body.no-scroll {
      overflow: auto !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  function cleanDOM() {
    const selectors = [
      '[id^="sp_message_container"]',
      '[id^="sp_message_iframe"]',
      '#unified-gdpr',
      '#sp_privacy_manager_container',
      '._sp_overlay',
      '.message-overlay',
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    document.body?.classList.remove('sp-lock', 'overflow-hidden', 'no-scroll');
    if (document.body?.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('DOMContentLoaded', cleanDOM);
  window.addEventListener('load', cleanDOM);

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        const id = node.id || '';
        const cls = typeof node.className === 'string' ? node.className : '';
        if (
          id.startsWith('sp_') ||
          id.includes('unified-gdpr') ||
          cls.includes('sp_') ||
          cls.includes('_sp_') ||
          cls.includes('consent') ||
          cls.includes('cookie-banner') ||
          cls.includes('gdpr')
        ) {
          node.remove();
          document.body?.classList.remove('sp-lock', 'overflow-hidden', 'no-scroll');
          if (document.body?.style.overflow === 'hidden') {
            document.body.style.overflow = '';
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
