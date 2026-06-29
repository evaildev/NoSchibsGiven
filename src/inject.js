// NoSchibsGiven — TCF-stub som kjører i sidens MAIN-verden (world: "MAIN").
//
// Når vi blokkerer SourcePoint (cdn.privacy-mgmt.com) på nettverksnivå, laster
// aldri det egentlige CMP-skriptet. VG/Schibsted sin innebygde __tcfapi-stub
// legger da samtykke-spørringer i en kø som aldri tømmes. Videospilleren
// (JWPlayer/AppNexus) venter på et samtykkesvar før den starter pre-roll og
// innhold — resultatet er at avspilling "henger" (jf. issue #1, VGTV i Edge).
//
// Denne stubben svarer umiddelbart med "GDPR gjelder, ingen samtykke gitt", slik
// at spilleren slutter å vente og spiller innholdet — uten personlig tilpassede
// annonser, og uten at samtykke-popupen slipper gjennom.

(function () {
  const LOCATOR = '__tcfapiLocator';

  function buildTCData(listenerId) {
    return {
      tcString: 'tcunavailable',
      tcfPolicyVersion: 2,
      cmpId: 6,
      cmpVersion: 1,
      gdprApplies: true,
      // 'useractioncomplete' signaliserer at brukeren har tatt et aktivt valg
      // (avslag). Spillere som JWPlayer venter ellers på denne statusen og
      // starter først etter en timeout — derav forsinkelsen på noen sekunder.
      eventStatus: 'useractioncomplete',
      cmpStatus: 'loaded',
      listenerId: listenerId,
      isServiceSpecific: true,
      useNonStandardStacks: false,
      publisherCC: 'NO',
      purposeOneTreatment: false,
      purpose: { consents: {}, legitimateInterests: {} },
      vendor: { consents: {}, legitimateInterests: {} },
      specialFeatureOptins: {},
    };
  }

  let nextListenerId = 0;

  function tcfapi(command, version, callback, parameter) {
    if (typeof callback !== 'function') return;
    try {
      switch (command) {
        case 'ping':
          callback(
            {
              gdprApplies: true,
              cmpLoaded: true,
              cmpStatus: 'loaded',
              displayStatus: 'hidden',
              apiVersion: '2.2',
              cmpId: 6,
              cmpVersion: 1,
              gvlVersion: 3,
            },
            true
          );
          break;
        case 'addEventListener':
          callback(buildTCData(nextListenerId++), true);
          break;
        case 'removeEventListener':
          callback(true);
          break;
        case 'getTCData':
        case 'getInAppTCData':
          callback(buildTCData(null), true);
          break;
        default:
          callback(null, false);
      }
    } catch (e) {
      try {
        callback(null, false);
      } catch (_) {
        /* ignore */
      }
    }
  }

  // Lås __tcfapi slik at SourcePoint sin (blokkerte) stub ikke kan overskrive
  // vår fungerende implementasjon. Setteren ignorerer i stillhet, så VG sin
  // tilordning kaster ikke selv i strict mode.
  try {
    Object.defineProperty(window, '__tcfapi', {
      configurable: false,
      get: function () {
        return tcfapi;
      },
      set: function () {
        /* behold vår stub */
      },
    });
  } catch (e) {
    window.__tcfapi = tcfapi;
  }

  // Locator-iframe og postMessage-svar for kallere i andre (cross-origin)
  // iframes, f.eks. annonse-SDK-er som spør CMP-en via __tcfapiLocator.
  function ensureLocator() {
    try {
      if (window.frames[LOCATOR]) return;
      if (document.body) {
        const frame = document.createElement('iframe');
        frame.style.cssText = 'display:none';
        frame.name = LOCATOR;
        document.body.appendChild(frame);
      } else {
        document.addEventListener('DOMContentLoaded', ensureLocator, { once: true });
      }
    } catch (e) {
      /* ignore */
    }
  }
  ensureLocator();

  window.addEventListener(
    'message',
    function (event) {
      const raw = event.data;
      const isString = typeof raw === 'string';
      let payload;
      try {
        payload = isString ? JSON.parse(raw) : raw;
      } catch (e) {
        return;
      }
      if (!payload || !payload.__tcfapiCall) return;
      const call = payload.__tcfapiCall;
      tcfapi(
        call.command,
        call.version,
        function (returnValue, success) {
          const response = {
            __tcfapiReturn: {
              returnValue: returnValue,
              success: success,
              callId: call.callId,
            },
          };
          const message = isString ? JSON.stringify(response) : response;
          if (event.source && typeof event.source.postMessage === 'function') {
            event.source.postMessage(message, event.origin === 'null' ? '*' : event.origin);
          }
        },
        call.parameter
      );
    },
    false
  );
})();
