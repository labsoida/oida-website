(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Header scroll effect (rAF-throttled) ---
  var siteHeader = document.getElementById('site-header');
  var backToTop = document.getElementById('backToTop');
  var scrollTicking = false;
  function onScrollRaf() {
    var y = window.scrollY;
    if (siteHeader) siteHeader.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('visible', y > 400);
    scrollTicking = false;
  }
  if (siteHeader || backToTop) {
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        requestAnimationFrame(onScrollRaf);
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // --- Mobile hamburger menu ---
  var menuToggle = document.getElementById('site-header-toggle');
  var menuLinks = document.getElementById('site-header-links');
  if (menuToggle && menuLinks) {
    function closeMenu() {
      menuLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Apri menu');
      document.body.classList.remove('menu-open');
    }
    function openMenu() {
      menuLinks.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Chiudi menu');
      document.body.classList.add('menu-open');
    }
    menuToggle.addEventListener('click', function () {
      if (menuLinks.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    // Chiudi cliccando su un link
    menuLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    // Chiudi con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuLinks.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- Back to top click handler (visibility handled in rAF scroll above) ---
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // --- Scroll-triggered animations ---
  if (!prefersReducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-animate-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

    document.querySelectorAll('.animate').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.animate').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --- Counter animation for KPI numbers ---
  if (!prefersReducedMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Smooth scroll for CTA ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

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
  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
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
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var ctx = c.getContext('2d');
    var cx = c.width / 2, cy = c.height / 2;
    var stars = [], i;
    for (i = 0; i < 140; i++) {
      stars.push({
        a: Math.random() * Math.PI * 2,
        d: 20 + Math.random() * Math.max(cx, cy),
        s: 0.5 + Math.random() * 2
      });
    }
    var t0 = performance.now();
    var DURATION = 1400;
    function frame(now) {
      var t = (now - t0) / DURATION;
      if (t >= 1) { c.remove(); return; }
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.globalAlpha = t > .8 ? (1 - t) * 5 : 1;
      var speed = Math.pow(t, 2) * 40 + 1;
      for (i = 0; i < stars.length; i++) {
        var s = stars[i];
        var d1 = s.d + t * speed * 8;
        var d2 = d1 + s.s * speed * 3;
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

  // --- Formspree AJAX form submission ---
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.contact-form__status');
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Invio in corso...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          status.textContent = 'Messaggio inviato. Ti ricontatteremo al più presto.';
          status.className = 'contact-form__status contact-form__status--success';
          form.reset();
        } else {
          throw new Error('Errore');
        }
      }).catch(function () {
        status.textContent = 'Errore nell\'invio. Riprova o scrivici a info@oida-labs.com.';
        status.className = 'contact-form__status contact-form__status--error';
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = originalText;
      });
    });
  }
})();
