/**
 * OIDA Labs — Cookie Consent configuration
 * Uses cookieconsent v3 (https://cookieconsent.orestbida.com)
 * MIT License, open source
 *
 * Implements Google Consent Mode v2 for GTM + Meta Pixel blocking until consent.
 */
(function () {
  'use strict';

  // Reference to gtag (defaults to denied are set inline in <head> before GTM)
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Configure cookieconsent
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof CookieConsent === 'undefined') {
      console.warn('CookieConsent library not loaded');
      return;
    }

    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
          equalWeightButtons: true,
          flipButtons: false
        },
        preferencesModal: {
          layout: 'box',
          equalWeightButtons: true,
          flipButtons: false
        }
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              { name: /^_ga/ },
              { name: '_gid' },
              { name: '_gat' }
            ]
          }
        },
        marketing: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              { name: /^_fb/ },
              { name: 'fr' }
            ]
          }
        }
      },

      // cookieconsent v3 passa un oggetto { cookie, ... }: serve param.cookie
      // (con .categories), non il parametro grezzo, altrimenti le categorie
      // risultano sempre vuote e nulla viene concesso anche dopo il consenso.
      onConsent: function (param) {
        updateConsentState(param.cookie);
      },

      onChange: function (param) {
        updateConsentState(param.cookie);
      },

      language: {
        default: 'it',
        translations: {
          it: {
            consentModal: {
              title: 'Cookie',
              description: 'Usiamo cookie tecnici per il funzionamento del sito e, previo consenso, cookie di analisi e marketing per migliorare l\'esperienza utente. Puoi accettare, rifiutare o personalizzare le tue scelte. Per maggiori informazioni consulta la <a href="/legal/cookie-policy/">Cookie Policy</a>.',
              acceptAllBtn: 'Accetta tutti',
              acceptNecessaryBtn: 'Rifiuta',
              showPreferencesBtn: 'Personalizza'
            },
            preferencesModal: {
              title: 'Preferenze cookie',
              acceptAllBtn: 'Accetta tutti',
              acceptNecessaryBtn: 'Rifiuta tutti',
              savePreferencesBtn: 'Salva preferenze',
              closeIconLabel: 'Chiudi',
              sections: [
                {
                  title: 'Uso dei cookie',
                  description: 'Utilizziamo cookie per garantire il corretto funzionamento del sito, per analizzare il traffico e, previo consenso, per finalità di marketing. Puoi modificare le tue preferenze in qualsiasi momento.'
                },
                {
                  title: 'Cookie strettamente necessari',
                  description: 'Indispensabili al funzionamento del sito (es. memorizzazione delle preferenze sui cookie). Non possono essere disattivati.',
                  linkedCategory: 'necessary'
                },
                {
                  title: 'Cookie analitici',
                  description: 'Raccolgono informazioni aggregate sulla navigazione per finalità statistiche tramite Google Analytics (GTM-M3B73NRN). Aiutano a capire come gli utenti usano il sito.',
                  linkedCategory: 'analytics'
                },
                {
                  title: 'Cookie di marketing',
                  description: 'Utilizzati per tracciare l\'efficacia delle campagne pubblicitarie e per il remarketing tramite Meta Pixel (Facebook/Instagram).',
                  linkedCategory: 'marketing'
                },
                {
                  title: 'Maggiori informazioni',
                  description: 'Per domande sull\'uso dei cookie, scrivi a <a href="mailto:info@oida-labs.com">info@oida-labs.com</a>. Trovi i dettagli completi nella nostra <a href="/legal/cookie-policy/">Cookie Policy</a> e nella <a href="/legal/privacy-policy/">Privacy Policy</a>.'
                }
              ]
            }
          }
        }
      }
    });
  });

  // 3) Update Google Consent Mode + load Meta Pixel based on user choice
  function updateConsentState(cookie) {
    var categories = cookie.categories || [];
    var analyticsGranted = categories.indexOf('analytics') !== -1;
    var marketingGranted = categories.indexOf('marketing') !== -1;

    // Update Google Consent Mode v2
    gtag('consent', 'update', {
      ad_storage: marketingGranted ? 'granted' : 'denied',
      ad_user_data: marketingGranted ? 'granted' : 'denied',
      ad_personalization: marketingGranted ? 'granted' : 'denied',
      analytics_storage: analyticsGranted ? 'granted' : 'denied'
    });

    // Load Meta Pixel only if marketing consent granted
    if (marketingGranted && !window._fbqLoaded) {
      window._fbqLoaded = true;
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '26427520853577542');
      fbq('track', 'PageView');
    }
  }
})();
