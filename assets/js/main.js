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

  // --- ↑↑↓↓←→←→BA (tastiera) ---
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
  // --- Konami touch (mobile): swipe su su giu giu sx dx sx dx + 2 tap ---
  (function () {
    var tseq = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'tap', 'tap'];
    var ti = 0, sx = 0, sy = 0, st = 0, timer;
    function reset() { ti = 0; }
    function feed(g) {
      clearTimeout(timer);
      if (g === tseq[ti]) {
        ti++;
        if (ti === tseq.length) { ti = 0; hyperspace(); return; }
        timer = setTimeout(reset, 2500); // combo da fare fluida
      } else {
        ti = (g === tseq[0]) ? 1 : 0;
        if (ti) timer = setTimeout(reset, 2500);
      }
    }
    document.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      sx = t.clientX; sy = t.clientY; st = e.timeStamp;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (e.changedTouches.length !== 1) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - sx, dy = t.clientY - sy;
      var adx = Math.abs(dx), ady = Math.abs(dy);
      if (adx < 24 && ady < 24) {
        if (e.timeStamp - st < 500) feed('tap'); else reset();
      } else if (adx > ady) {
        feed(dx > 0 ? 'right' : 'left');
      } else {
        feed(dy > 0 ? 'down' : 'up');
      }
    }, { passive: true });
  })();
  // Salto nell'iperspazio stile Star Wars: stelle in proiezione prospettica che
  // volano verso lo spettatore, "punch it" iniziale, lampo al balzo, scie con
  // motion-blur. ~4,2s. Auto-cleanup a tempo (sopravvive al cambio scheda).
  function hyperspace() {
    if (prefersReducedMotion || document.getElementById('hyperspace')) return;
    var DURATION = 4200;
    var c = document.createElement('canvas');
    c.id = 'hyperspace';
    c.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;background:#000';
    document.body.appendChild(c);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = c.width = Math.round(window.innerWidth * dpr);
    var H = c.height = Math.round(window.innerHeight * dpr);
    var ctx = c.getContext('2d'), cx = W / 2, cy = H / 2, FOCAL = W, N = 360, stars = [], i;
    function spawn(deep) {
      return {
        x: (Math.random() * 2 - 1) * W,
        y: (Math.random() * 2 - 1) * H,
        z: deep ? W * (0.2 + Math.random() * 0.8) : Math.random() * W,
        white: Math.random() < 0.22
      };
    }
    for (i = 0; i < N; i++) { stars.push(spawn(false)); }
    // safety: se la scheda va in background a metà salto, rAF si ferma; questo lo rimuove comunque
    var killer = setTimeout(function () { if (c.parentNode) c.remove(); }, DURATION + 800);
    var t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / DURATION;
      if (t >= 1) { clearTimeout(killer); c.remove(); return; }
      // profilo velocita: deriva sublight -> SPINTA -> crociera lightspeed -> decelera
      var warp;
      if (t < 0.20) warp = 0.6 + t * 4;                       // sublight
      else if (t < 0.30) warp = 1.4 + ((t - 0.20) / 0.10) * 15; // punch it
      else if (t < 0.82) warp = 16.4;                          // lightspeed
      else warp = 16.4 * (1 - (t - 0.82) / 0.18);              // drop out
      var speed = warp * 14 * dpr + 0.5;
      var fade = t > 0.9 ? (1 - t) / 0.1 : 1;
      // motion-blur: velo nero semitrasparente invece del clear
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.32)';
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (i = 0; i < stars.length; i++) {
        var s = stars[i], pz = s.z;
        s.z -= speed;
        if (s.z < 1) { stars[i] = spawn(true); continue; }
        var k = FOCAL / s.z, pk = FOCAL / pz;
        var b = Math.min(1, (W - s.z) / W);
        ctx.globalAlpha = b * fade;
        ctx.strokeStyle = s.white ? 'rgba(225,255,252,1)' : 'rgba(0,194,178,1)';
        ctx.lineWidth = Math.max(0.7, b * 2.6) * dpr;
        ctx.beginPath();
        ctx.moveTo(cx + s.x * pk, cy + s.y * pk);
        ctx.lineTo(cx + s.x * k, cy + s.y * k);
        ctx.stroke();
      }
      // lampo centrale al momento della spinta (~t 0.30)
      if (t > 0.20 && t < 0.46) {
        var fa = 1 - Math.abs(t - 0.31) / 0.13;
        if (fa > 0) {
          var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
          g.addColorStop(0, 'rgba(200,255,250,' + (fa * 0.55) + ')');
          g.addColorStop(0.35, 'rgba(0,194,178,' + (fa * 0.20) + ')');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalAlpha = 1;
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
