(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function isMobile() { return window.matchMedia('(max-width:900px)').matches; }

  // --- Apre l'accordion della sezione di destinazione (evita il doppio tap menu -> "+") ---
  function openSection(sec) {
    if (sec && sec.querySelector && sec.querySelector('.s-header')) {
      sec.classList.add('is-open');
      syncSectionAria(sec);
    }
  }
  // Arrivo da pagina interna con hash (es. /#servizi): apri subito la sezione
  if (window.location.hash) {
    try { openSection(document.querySelector(window.location.hash)); } catch (e) {}
  }
  // Cambio hash senza ricaricare (back/forward, barra indirizzi)
  window.addEventListener('hashchange', function () {
    try { openSection(document.querySelector(window.location.hash)); } catch (e) {}
  });

  // --- Hamburger menu mobile ---
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-links');
  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Apri menu');
    document.body.classList.remove('menu-open');
  }
  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Chiudi menu');
    document.body.classList.add('menu-open');
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    navMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) closeMenu();
    });
  }

  // --- Accordion sezioni (home): FAQ e Pubblicazioni anche su desktop, le altre solo su mobile ---
  var SECTION_IDS = ['chi', 'servizi', 'perche', 'pubblicazioni', 'faq', 'contatti'];
  function isCollapsible(sid) { return sid === 'faq' || sid === 'pubblicazioni' || isMobile(); }
  // aria-expanded sul bottone disclosure: riflette lo stato reale (sezioni non
  // collassabili nel viewport corrente = sempre espanse)
  function syncSectionAria(sec) {
    var btn = sec.querySelector('.s-disclose');
    if (!btn) return;
    var expanded = sec.classList.contains('is-open') || !isCollapsible(sec.id);
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
  SECTION_IDS.forEach(function (sid) {
    var sec = document.getElementById(sid);
    if (!sec) return;
    var header = sec.querySelector('.s-header');
    if (!header) return;
    syncSectionAria(sec);
    header.addEventListener('click', function (e) {
      if (!isCollapsible(sid)) return;
      if (e.target.closest('a')) return;
      sec.classList.toggle('is-open');
      syncSectionAria(sec);
    });
  });
  window.addEventListener('resize', function () {
    SECTION_IDS.forEach(function (sid) {
      var sec = document.getElementById(sid);
      if (sec) syncSectionAria(sec);
    });
  });

  // --- Smooth scroll per ancore interne (aprendo l'accordion di destinazione) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        openSection(target);
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // --- Form Formspree con feedback inline (no redirect) ---
  var ctaForm = document.getElementById('cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = ctaForm.querySelector('.cta-status');
      var btn = ctaForm.querySelector('button[type="submit"]');
      status.textContent = '// invio in corso...';
      status.setAttribute('data-status', '');
      if (btn) btn.disabled = true;
      fetch(ctaForm.action, {
        method: 'POST',
        body: new FormData(ctaForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        return r.ok ? { ok: true } : { ok: false };
      }).then(function (res) {
        if (res.ok) {
          status.textContent = '// messaggio inviato. Ti rispondiamo entro 24h.';
          status.setAttribute('data-status', 'success');
          ctaForm.reset();
        } else {
          status.textContent = '// errore. Scrivici a info@oida-labs.com';
          status.setAttribute('data-status', 'error');
        }
        if (btn) btn.disabled = false;
      }).catch(function () {
        status.textContent = '// errore di connessione. Scrivici a info@oida-labs.com';
        status.setAttribute('data-status', 'error');
        if (btn) btn.disabled = false;
      });
    });
  }

  // --- Starfield: cielo casuale e unico per ogni .dusted (deterministico) ---
  (function () {
    function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    function sky(seed, n) { var r = rng(seed), a = []; for (var i = 0; i < n; i++) { var x = (r() * 100).toFixed(2), y = (r() * 100).toFixed(2), s = (1.2 + r() * 2.2).toFixed(1), o = (0.3 + r() * 0.48).toFixed(2), c = r() < 0.18 ? '255,255,255' : '0,194,178'; a.push('radial-gradient(' + s + 'px ' + s + 'px at ' + x + '% ' + y + '%, rgba(' + c + ',' + o + ') 50%, transparent 51%)'); } return a.join(','); }
    document.querySelectorAll('.dusted').forEach(function (el, i) { el.style.setProperty('--stars-d', sky((i + 1) * 97 + 13, 16)); });
  })();

  // --- Telemetria di bordo (per chi apre il cofano) ---
  try {
    var mono = 'font-family:monospace';
    console.log('%c// OIDA-1 · BOOT SEQUENCE COMPLETE', 'color:#00C2B2;' + mono);
    console.log('%c// all systems nominal · orbit stable · 46.0037° N, 8.9511° E', 'color:#999;' + mono);
    console.log('%c// Klaatu barada nikto.', 'color:#999;' + mono);
    console.log('%c// xyzzy', 'color:#444;' + mono);
    console.log('%c// End of line.', 'color:#00C2B2;' + mono);
  } catch (e) {}

  // --- ↑↑↓↓←→←→BA ---
  var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var seqIdx = 0;
  document.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === seq[seqIdx]) {
      seqIdx++;
      if (seqIdx === seq.length) { seqIdx = 0; hyperspace(); }
    } else {
      seqIdx = (k === seq[0]) ? 1 : 0;
    }
  });
  function hyperspace() {
    if (prefersReducedMotion || document.getElementById('hyperspace')) return;
    var c = document.createElement('canvas');
    c.id = 'hyperspace';
    c.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none';
    document.body.appendChild(c);
    c.width = window.innerWidth; c.height = window.innerHeight;
    var ctx = c.getContext('2d'), cx = c.width / 2, cy = c.height / 2, stars = [], i;
    for (i = 0; i < 140; i++) { stars.push({ a: Math.random() * Math.PI * 2, d: 20 + Math.random() * Math.max(cx, cy), s: 0.5 + Math.random() * 2 }); }
    var t0 = performance.now(), DURATION = 1400;
    function frame(now) {
      var t = (now - t0) / DURATION;
      if (t >= 1) { c.remove(); return; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.globalAlpha = t > .8 ? (1 - t) * 5 : 1;
      var speed = Math.pow(t, 2) * 40 + 1;
      for (i = 0; i < stars.length; i++) {
        var s = stars[i], d1 = s.d + t * speed * 8, d2 = d1 + s.s * speed * 3;
        ctx.strokeStyle = i % 5 === 0 ? 'rgba(255,255,255,.85)' : 'rgba(0,194,178,.8)';
        ctx.lineWidth = s.s * (0.5 + t);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(s.a) * d1, cy + Math.sin(s.a) * d1);
        ctx.lineTo(cx + Math.cos(s.a) * d2, cy + Math.sin(s.a) * d2);
        ctx.stroke();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
