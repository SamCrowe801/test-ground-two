/* ============================================
   GLASSMORPHIC RESUME — Interactive Scripts
   ============================================ */

(function () {
  'use strict';

  // ---------- Navigation Scroll Effect ----------
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // ---------- Mobile Navigation Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Active Nav Link Highlight ----------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', highlightNav, { passive: true });
  }

  // ---------- Scroll Animations (Intersection Observer) ----------
  var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left');

  if ('IntersectionObserver' in window && animatedElements.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---------- Contact Form Submission ----------
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var originalText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = 'Sending...';
      formSubmitBtn.disabled = true;
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          formStatus.textContent = 'Message sent successfully. I will be in touch shortly.';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          return response.json().then(function (data) {
            if (data.errors) {
              throw new Error(data.errors.map(function (err) { return err.message; }).join(', '));
            }
            throw new Error('Submission failed. Please try again.');
          });
        }
      })
      .catch(function (err) {
        formStatus.textContent = err.message || 'Something went wrong. Please email Samuel@thecrowells.com directly.';
        formStatus.className = 'form-status error';
      })
      .finally(function () {
        formSubmitBtn.innerHTML = originalText;
        formSubmitBtn.disabled = false;
      });
    });
  }
})();
