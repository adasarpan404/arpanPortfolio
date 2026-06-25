/* ─── Manuscript Portfolio — GSAP Animations & Interactions ─── */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // ─── Loading Screen ───
  function initLoading() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    const spiral = loader.querySelector('.spiral-loader');
    if (spiral && !prefersReducedMotion) {
      gsap.to(spiral, { rotation: 360, duration: 2, repeat: -1, ease: 'none' });
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        initHeroAnimations();
      }, 800);
    });
  }

  // ─── Hero Text "Writing" Animation ───
  function initHeroAnimations() {
    const title = document.querySelector('.hero-title');
    if (!title || prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      return;
    }

    const text = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';

    const chars = text.split('');
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      title.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.05,
        delay: 0.3 + i * 0.06,
        ease: 'power2.out',
      });
    });

    gsap.from('.hero-tagline', {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 1.2,
      ease: 'power3.out',
    });

    gsap.from('.hero-cta', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 1.6,
      stagger: 0.15,
      ease: 'power3.out',
    });

    gsap.from('.hero-contact', {
      opacity: 0,
      duration: 0.6,
      delay: 2,
    });

    gsap.from('.avatar-sketch', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.4)',
    });
  }

  // ─── ScrollTrigger Section Reveals ───
  function initScrollAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.reveal-section').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Section unfurl effect
    gsap.utils.toArray('.reveal-section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        rotateX: 8,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // Pantry cards stagger
    gsap.utils.toArray('.pantry-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
        },
        opacity: 0,
        y: 40,
        rotation: (i % 2 === 0 ? -2 : 2),
        duration: 0.7,
        delay: i * 0.08,
        ease: 'power2.out',
      });
    });

    // Sketch motif images
    gsap.utils.toArray('.motif-card, .metamorphosis-panel, .sketch-frame').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        },
        opacity: 0,
        scale: 0.92,
        duration: 0.7,
        delay: i * 0.05,
        ease: 'back.out(1.1)',
      });
    });

    // Project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'back.out(1.2)',
      });
    });

    // Timeline draw effect
    const timelineLine = document.querySelector('.timeline-svg-line');
    if (timelineLine) {
      const length = timelineLine.getTotalLength();
      timelineLine.style.strokeDasharray = length;
      timelineLine.style.strokeDashoffset = length;

      gsap.to(timelineLine, {
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
        strokeDashoffset: 0,
        ease: 'none',
      });
    }

    // Timeline entries
    gsap.utils.toArray('.timeline-entry').forEach((entry, i) => {
      gsap.from(entry, {
        scrollTrigger: {
          trigger: entry,
          start: 'top 85%',
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out',
      });
    });

    // Parallax spirals
    gsap.utils.toArray('.parallax-layer').forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed) || 0.3;
      gsap.to(layer, {
        scrollTrigger: {
          trigger: layer.parentElement || document.body,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: () => speed * 100,
        ease: 'none',
      });
    });
  }

  // ─── Timeline Expand/Collapse ───
  function initTimeline() {
    document.querySelectorAll('.timeline-entry').forEach((entry) => {
      entry.addEventListener('click', () => {
        const wasExpanded = entry.classList.contains('expanded');
        document.querySelectorAll('.timeline-entry').forEach((e) => e.classList.remove('expanded'));
        if (!wasExpanded) entry.classList.add('expanded');
      });
    });
  }

  // ─── Custom Pencil Cursor ───
  function initCursor() {
    if (isMobile) {
      document.body.classList.add('no-custom-cursor');
      return;
    }

    const dot = document.querySelector('.cursor-dot');
    const pencil = document.querySelector('.cursor-pencil');
    const trail = document.querySelector('.cursor-trail');
    if (!dot || !pencil || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      pencil.style.left = mouseX + 'px';
      pencil.style.top = mouseY + 'px';

      if (!prefersReducedMotion && Math.random() > 0.7) {
        const mark = document.createElement('div');
        mark.className = 'trail-mark';
        mark.style.left = mouseX + 'px';
        mark.style.top = mouseY + 'px';
        trail.appendChild(mark);
        setTimeout(() => mark.remove(), 1200);
      }
    });

    function animateDot() {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
      requestAnimationFrame(animateDot);
    }
    animateDot();

    document.querySelectorAll('a, button, .timeline-entry, .pantry-card, .project-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(dot, { scale: 2, duration: 0.2 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(dot, { scale: 1, duration: 0.2 });
      });
    });
  }

  // ─── Dark Mode Toggle ───
  function initDarkMode() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('manuscript-theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-mode');
      toggle.setAttribute('aria-pressed', 'true');
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('manuscript-theme', isDark ? 'dark' : 'light');
      toggle.setAttribute('aria-pressed', String(isDark));

      if (!prefersReducedMotion) {
        gsap.fromTo(document.body, { opacity: 0.9 }, { opacity: 1, duration: 0.4 });
      }
    });
  }

  // ─── Sticky Nav Visibility ───
  function initNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ─── Limitly Rate Counter Animation ───
  function initRateCounter() {
    const counter = document.getElementById('rate-counter');
    if (!counter || prefersReducedMotion) return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    let count = 0;
    const target = 20000;
    const duration = 3000;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          count = Math.floor(eased * target);
          counter.textContent = count.toLocaleString() + '/sec';
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
    });
  }

  // ─── Font Jitter on Load ───
  function initFontJitter() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.jitter-text').forEach((el) => {
      const original = el.textContent;
      let iterations = 0;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((c, i) => {
            if (c === ' ') return ' ';
            return i < iterations ? original[i] : chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iterations += 0.5;
        if (iterations >= original.length) clearInterval(interval);
      }, 30);
    });
  }

  // ─── Smooth anchor scroll offset for fixed nav ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ─── Init ───
  document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initScrollAnimations();
    initTimeline();
    initCursor();
    initDarkMode();
    initNav();
    initRateCounter();
    initFontJitter();
    initSmoothScroll();
  });
})();