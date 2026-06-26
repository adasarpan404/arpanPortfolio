/* ─── Manuscript Portfolio — GSAP Animations & Interactions ─── */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isCompact = window.matchMedia('(max-width: 768px), (max-height: 820px)').matches;
  const mobileMedia = window.matchMedia('(max-width: 768px)');
  const compactMedia = window.matchMedia('(max-width: 768px), (max-height: 820px)');

  function revealHeroContent() {
    document.querySelectorAll('.hero-tagline, .hero-cta, .hero-contact').forEach((el) => {
      el.classList.remove('opacity-0');
      el.style.opacity = '1';
    });
    const illus = document.querySelector('.hero-illustration-wrapper');
    if (illus) illus.style.opacity = '1';
  }

  function onPageReady(callback) {
    if (document.readyState === 'complete') {
      callback();
      return;
    }
    window.addEventListener('load', callback, { once: true });
  }

  // ─── Loading Screen ───
  function initLoading() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      loader.classList.add('hidden');
      initHeroAnimations();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    };

    const spiral = loader.querySelector('.spiral-loader');
    if (spiral && !prefersReducedMotion) {
      gsap.to(spiral, { rotation: 360, duration: 2, repeat: -1, ease: 'none' });
    }

    onPageReady(() => setTimeout(dismiss, 800));
    setTimeout(dismiss, 3000);
  }

  // ─── Hero Text "Writing" Animation ───
  function initHeroAnimations() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    if (prefersReducedMotion) {
      title.style.opacity = '1';
      revealHeroContent();
      return;
    }

    const text = title.textContent;
    title.textContent = '';
    title.classList.remove('opacity-0');
    title.style.opacity = '1';

    const chars = text.split('');
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      span.style.transform = 'translateY(10px)';
      title.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.05,
        delay: 0.3 + i * 0.06,
        ease: 'power2.out',
      });
    });

    gsap.fromTo('.hero-tagline',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 1.2, stagger: 0.2, ease: 'power3.out' }
    );

    gsap.fromTo('.hero-cta',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.6, stagger: 0.15, ease: 'power3.out' }
    );

    gsap.fromTo('.hero-contact',
      { opacity: 0 },
      { opacity: 1, duration: 0.6, delay: 2 }
    );

    gsap.fromTo('.avatar-sketch',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)' }
    );

    gsap.fromTo('.hero-illustration-wrapper',
      { opacity: 0, x: 40, rotation: -3 },
      { opacity: 1, x: 0, rotation: 0, duration: 1.2, delay: 1.8, ease: 'power3.out' }
    );
  }

  // ─── ScrollTrigger Section Reveals ───
  function initScrollAnimations() {
    const animatedSelectors = '.reveal-section, .pantry-card, .project-card, .article-card, .timeline-entry, .motif-card, .metamorphosis-panel, .sketch-frame';

    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll(animatedSelectors).forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      ignoreMobileResize: true,
      limitCallbacks: true,
    });

    const isBelowFold = (el) => el.getBoundingClientRect().top > window.innerHeight * 0.85;

    const hideBelowFold = (targets, fromVars) => {
      gsap.utils.toArray(targets).forEach((el, i) => {
        if (!isBelowFold(el)) return;
        const from = typeof fromVars === 'function' ? fromVars(el, i) : fromVars;
        gsap.set(el, from);
      });
    };

    const scrollReveal = (targets, fromVars, toVars, triggerOpts = {}) => {
      const elements = gsap.utils.toArray(targets);
      if (!elements.length) return;

      hideBelowFold(elements, fromVars);

      const trigger = triggerOpts.trigger
        || elements[0].closest('section')
        || elements[0];

      gsap.to(elements, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        rotateX: 0,
        ...toVars,
        stagger: toVars.stagger || 0,
        scrollTrigger: {
          trigger,
          start: triggerOpts.start || 'top 82%',
          once: true,
          toggleActions: 'play none none none',
        },
      });
    };

    // Section unfurl effect
    gsap.utils.toArray('.reveal-section').forEach((section) => {
      if (section.id === 'articles') return;

      hideBelowFold([section], {
        opacity: 0,
        y: isCompact ? 50 : 70,
        rotateX: isCompact ? 0 : 8,
      });

      gsap.to(section, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      });
    });

    // Articles — stagger heading + cards together
    const articlesSection = document.querySelector('#articles');
    if (articlesSection) {
      const articleItems = articlesSection.querySelectorAll('h2, .text-warm-brown, .text-center.mb-12, .article-card');
      hideBelowFold(articleItems, { opacity: 0, y: 45 });

      gsap.to(articleItems, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: articlesSection,
          start: 'top 78%',
          once: true,
        },
      });
    }

    // Pantry cards stagger
    scrollReveal(
      '.pantry-card',
      (_, i) => ({ opacity: 0, y: 50, rotation: i % 2 === 0 ? -3 : 3 }),
      { duration: 0.75, stagger: 0.1, ease: 'power2.out' },
      { start: 'top 88%' }
    );

    // Sketch motif images
    scrollReveal(
      '.motif-card, .metamorphosis-panel, .sketch-frame',
      { opacity: 0, scale: 0.9 },
      { duration: 0.75, stagger: 0.08, ease: 'back.out(1.1)' },
      { start: 'top 88%' }
    );

    // Project cards
    scrollReveal(
      '.project-card',
      { opacity: 0, y: 50, scale: 0.94 },
      { duration: 0.85, stagger: 0.14, ease: 'back.out(1.2)' },
      { start: 'top 88%' }
    );

    // Timeline draw effect (scrub is heavy on mobile — use one-shot reveal instead)
    const timelineLine = document.querySelector('.timeline-svg-line');
    if (timelineLine) {
      const length = timelineLine.getTotalLength();
      timelineLine.style.strokeDasharray = length;
      timelineLine.style.strokeDashoffset = length;

      if (isCompact) {
        gsap.to(timelineLine, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
            once: true,
          },
        });
      } else {
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
    }

    // Timeline entries
    scrollReveal(
      '.timeline-entry',
      { opacity: 0, x: -40 },
      { duration: 0.7, stagger: 0.12, ease: 'power2.out' },
      { start: 'top 85%' }
    );

    if (!isCompact) {
      initParallax();
    }

    onPageReady(() => ScrollTrigger.refresh());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => ScrollTrigger.refresh(), 300);
    });
    mobileMedia.addEventListener('change', () => ScrollTrigger.refresh());
    compactMedia.addEventListener('change', () => ScrollTrigger.refresh());
  }

  // ─── Parallax Depth Layers (desktop only — scrub parallax janks mobile scroll) ───
  function initParallax() {
    if (isCompact || prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    const range = isCompact ? 240 : 380;

    const applySpin = (el) => {
      if (el.dataset.spin === 'none') return;

      if (el.classList.contains('spin-reverse')) {
        el.style.animation = 'none';
        gsap.to(el, { rotation: -360, duration: 120, repeat: -1, ease: 'none' });
        return;
      }

      if (el.classList.contains('spin-slow') || el.classList.contains('spiral-divider-img')) {
        el.style.animation = 'none';
        const duration = el.classList.contains('motif-float') ? 90
          : el.classList.contains('spiral-divider-img') ? 45
          : 60;
        gsap.to(el, { rotation: 360, duration, repeat: -1, ease: 'none' });
      }
    };

    gsap.utils.toArray('.parallax-layer, .parallax-content').forEach((el) => {
      if (isCompact && el.classList.contains('parallax-content') && el.closest('#hero')) {
        return;
      }

      applySpin(el);

      const speed = parseFloat(el.dataset.speed) || 0.3;
      const speedX = parseFloat(el.dataset.speedX) || 0;
      const trigger = el.closest('section, header, footer') || el.parentElement || document.body;

      gsap.to(el, {
        scrollTrigger: {
          trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: isCompact ? 0.6 : 1.2,
        },
        y: speed * range,
        x: speedX * range * 0.5,
        ease: 'none',
      });
    });

    const paper = document.querySelector('.paper-canvas');
    if (paper) {
      gsap.to(paper, {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
        y: isCompact ? 80 : 160,
        ease: 'none',
      });
    }
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
    if (isCompact) {
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

  // ─── Sticky Nav Visibility ───
  function initNav() {
    const nav = document.querySelector('.site-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const sectionIds = ['about', 'pantry', 'experience', 'projects', 'articles', 'education', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setActive = (id) => {
      document.querySelectorAll('.site-nav a, .mobile-nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
    };

    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(() => {
        if (nav) {
          nav.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
        }

        const offset = window.innerHeight * 0.35;
        let current = sectionIds[0];
        sections.forEach((section) => {
          if (section.getBoundingClientRect().top <= offset) {
            current = section.id;
          }
        });
        setActive(current);
        navTicking = false;
      });
    }, { passive: true });

    if (mobileNav) {
      mobileNav.addEventListener('click', (e) => {
        const link = e.target.closest('.mobile-nav-link');
        if (!link) return;
        setActive(link.getAttribute('href').slice(1));
      });
    }
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

  // ─── Scroll Down Indicator ───
  function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    const hide = () => indicator.classList.add('is-hidden');

    window.addEventListener('scroll', () => {
      indicator.classList.toggle('is-hidden', window.scrollY > 80);
    }, { passive: true });

    indicator.addEventListener('click', hide);

    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
      const chevron = indicator.querySelector('.scroll-indicator-chevron');
      if (chevron) {
        gsap.to(chevron, {
          y: 10,
          duration: 1.1,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }
    }
  }

  // ─── Smooth anchor scroll offset for fixed nav ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: isCompact ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  // ─── Init ───
  document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initScrollAnimations();
    initTimeline();
    initCursor();
    initNav();
    initRateCounter();
    initFontJitter();
    initSmoothScroll();
    initScrollIndicator();
    onPageReady(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });
})();