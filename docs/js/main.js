(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Header scroll effect (Fix #1) ---
  var siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // --- Back to top button (Fix #14) ---
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
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
