/* ═══════════════════════════════════════
   MAIN.JS — Oksana Moroz Studio
   GSAP + ScrollTrigger + Lenis + Swiper
   ═══════════════════════════════════════ */

(function () {
  'use strict';

  // ─────────────────────────────────────
  // PRELOADER
  // ─────────────────────────────────────
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  }

  // Wait for fonts to load before showing content
  async function initPreloader() {
    if (!preloader) return;
    
    try {
      // Wait for all fonts to be loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    } catch (e) {
      console.warn('Font Loading API not available:', e);
    }
    
    // Also wait for page to fully load
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        window.addEventListener('load', resolve, { once: true });
      });
    }
    
    // Hide preloader
    hidePreloader();
  }

  // Start preloader logic
  initPreloader();

  // Fallback: remove after 5s max (safety net)
  setTimeout(hidePreloader, 5000);


  // ─────────────────────────────────────
  // LENIS SMOOTH SCROLL
  // ─────────────────────────────────────
  let lenis;

  function initLenis() {
    // На мобильных отключаем Lenis, чтобы не перехватывать touch-события свайпера
    if (window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }


  // ─────────────────────────────────────
  // HEADER SCROLL EFFECT
  // ─────────────────────────────────────
  const header = document.getElementById('header');

  function initHeaderScroll() {
    if (!header) return;

    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        if (self.scroll() > 80) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }
    });
  }


  // ─────────────────────────────────────
  // MOBILE NAV
  // ─────────────────────────────────────
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navClose = document.getElementById('navClose');

  function initMobileNav() {
    if (!burger || !nav) return;

    function closeNav() {
      burger.classList.remove('is-active');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      if (lenis) lenis.start();
    }

    burger.addEventListener('click', () => {
      const isOpening = !nav.classList.contains('is-open');
      
      burger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      
      // Block scroll
      if (isOpening) {
        document.body.classList.add('nav-open');
        if (lenis) lenis.stop();
      } else {
        document.body.classList.remove('nav-open');
        if (lenis) lenis.start();
      }
    });

    // Close button in nav
    if (navClose) {
      navClose.addEventListener('click', closeNav);
    }

    // Close nav on link click
    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
      }
    });
  }


  // ─────────────────────────────────────
  // HERO PARALLAX
  // ─────────────────────────────────────
  function initHeroParallax() {
    const heroBg = document.querySelector('.hero__bg-img');
    if (!heroBg) return;

    gsap.to(heroBg, {
      y: '-20%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      }
    });
  }


  // ─────────────────────────────────────
  // HERO ENTRANCE ANIMATIONS
  // ─────────────────────────────────────
  function initHeroEntrance() {
    // Skip if hero elements missing to avoid console errors
    if (!document.querySelector('.hero__title')) return;

    const tl = gsap.timeline({
      delay: 0.8,
      defaults: { ease: 'power3.out' }
    });

    tl.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8
    })
    .to('.hero__title-line', {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 1
    }, '-=0.4')
    .to('.hero__desc', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.5')
    .to('.hero__buttons', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.4')
    .to('.hero__badge', {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, '-=0.3');
    
    // Animate scroll hint if it exists
    const scrollHint = document.querySelector('.hero__scroll-hint');
    if (scrollHint) {
      tl.to(scrollHint, {
        opacity: 1,
        duration: 0.6
      }, '-=0.2');
    }
  }


  // ─────────────────────────────────────
  // SCROLL-TRIGGERED ANIMATIONS
  // ─────────────────────────────────────
  function initScrollAnimations() {
    // Generic fade-in for elements outside hero
    // Exclude .care__card — animated by dedicated initCareStagger()
    // .advantages__item is NOT excluded: initAdvantages() only animates the icon SVG,
    // while this handles the item's own opacity/translate fade-in — no conflict
    const animElements = document.querySelectorAll('.section .anim-fade:not(.care__card)');

    animElements.forEach((el, i) => {
      const anim = el.dataset.anim || 'fade-up';
      const fromVars = { opacity: 0 };

      switch (anim) {
        case 'fade-up':
          fromVars.y = 40;
          break;
        case 'fade-down':
          fromVars.y = -40;
          break;
        case 'fade-right':
          fromVars.x = -60;
          fromVars.y = 0;
          break;
        case 'fade-left':
          fromVars.x = 60;
          fromVars.y = 0;
          break;
        default:
          fromVars.y = 40;
      }

      gsap.fromTo(el, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }


  // ─────────────────────────────────────
  // COUNT-UP ANIMATION (About stats)
  // ─────────────────────────────────────
  function initCountUp() {
    const counters = document.querySelectorAll('.about__stat-number[data-count]');

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10);

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function () {
              counter.textContent = Math.round(parseFloat(this.targets()[0].innerText) || 0);
            }
          });
        }
      });
    });
  }


  // ─────────────────────────────────────
  // MASTERY SECTION
  // ─────────────────────────────────────
  
  // Функция для активации таба по его ключу
  function activateMasteryTab(targetKey, tabButtons, panels) {
    // Find the button with matching data-mastery
    const button = Array.from(tabButtons).find(btn => btn.getAttribute('data-mastery') === targetKey);
    if (!button) return;

    // Don't re-animate if already active
    if (button.classList.contains('mastery__tab-btn--active')) return;

    // Remove active from all buttons
    tabButtons.forEach(btn => btn.classList.remove('mastery__tab-btn--active'));
    button.classList.add('mastery__tab-btn--active');

    // Hide all panels
    panels.forEach(panel => {
      panel.classList.remove('mastery__panel--active');
    });

    // Show target panel with animation
    const target = document.querySelector(`.mastery__panel[data-mastery="${targetKey}"]`);
    if (target) {
      target.classList.add('mastery__panel--active');

      // Animate panel content directly (replaces MutationObserver approach)
      const img = target.querySelector('.mastery__panel-image img');
      const info = target.querySelector('.mastery__panel-info');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
        );
      }
      if (info) {
        gsap.fromTo(info,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
        );
      }
    }

    // Scroll only the tabs-nav container (NOT the page) to show active button
    const tabsNav = button.closest('.mastery__tabs-nav');
    if (tabsNav && tabsNav.scrollWidth > tabsNav.clientWidth) {
      const scrollLeft = button.offsetLeft - tabsNav.clientWidth / 2 + button.offsetWidth / 2;
      tabsNav.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
    }
  }

  // Функция для инициализации свайпов на мобильных устройствах
  function initMasterySwipe() {
    const tabsContainer = document.querySelector('.mastery__tabs');
    const tabButtons = document.querySelectorAll('.mastery__tab-btn');
    const panels = document.querySelectorAll('.mastery__panel');

    if (!tabsContainer || tabButtons.length === 0) return;

    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // минимальное расстояние свайпа в пикселях

    tabsContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    tabsContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const absDiff = Math.abs(diff);

      // Если расстояние меньше порога, игнорируем
      if (absDiff < swipeThreshold) return;

      // Найдём текущую активную кнопку
      const activeButton = document.querySelector('.mastery__tab-btn--active');
      if (!activeButton) return;

      const currentIndex = Array.from(tabButtons).indexOf(activeButton);
      let nextIndex = currentIndex;

      // Свайп влево (diff > 0) = следующий таб
      if (diff > 0) {
        nextIndex = (currentIndex + 1) % tabButtons.length;
      }
      // Свайп вправо (diff < 0) = предыдущий таб
      else if (diff < 0) {
        nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      }

      // Активируем нужный таб
      const nextButton = tabButtons[nextIndex];
      const nextKey = nextButton.getAttribute('data-mastery');
      activateMasteryTab(nextKey, tabButtons, panels);
    }
  }

  function initMasteryTabs() {
    const tabButtons = document.querySelectorAll('.mastery__tab-btn');
    const panels = document.querySelectorAll('.mastery__panel');
    const tabsContainer = document.querySelector('.mastery__tabs');

    if (tabButtons.length === 0 || panels.length === 0) return;

    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetKey = button.getAttribute('data-mastery');
        activateMasteryTab(targetKey, tabButtons, panels);
      });
    });

    // Инициализируем свайпы на мобильных устройствах
    initMasterySwipe();
  }

  // ─────────────────────────────────────
  // CARE CARDS STAGGER
  // ─────────────────────────────────────
  function initCareStagger() {
    const cards = document.querySelectorAll('.care__card');
    if (!cards.length) return;

    gsap.fromTo(cards, {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.care__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }


  // ─────────────────────────────────────
  // ADVANTAGES ICONS ANIMATION
  // ─────────────────────────────────────
  function initAdvantages() {
    const items = document.querySelectorAll('.advantages__item');
    if (!items.length) return;

    items.forEach((item) => {
      const icon = item.querySelector('.advantages__icon svg');
      if (!icon) return;

      ScrollTrigger.create({
        trigger: item,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(icon, {
            scale: 0,
            rotation: -180,
          }, {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
          });
        }
      });
    });
  }


  // ─────────────────────────────────────
  // PROMO CARDS ANIMATION
  // ─────────────────────────────────────
  function initPromo() {
    const cards = document.querySelectorAll('.promo__card');
    if (!cards.length) return;

    gsap.fromTo(cards, {
      opacity: 0,
      scale: 0.9,
      y: 30,
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.promo__cards',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }


  // ─────────────────────────────────────
  // CTA PARALLAX
  // ─────────────────────────────────────
  function initCtaParallax() {
    const ctaBg = document.querySelector('.cta__bg-img');
    if (!ctaBg) return;

    gsap.to(ctaBg, {
      y: '-15%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      }
    });
  }


  // ─────────────────────────────────────
  // MARQUEE SPEED ON SCROLL
  // ─────────────────────────────────────
  function initMarqueeScroll() {
    const track = document.querySelector('.marquee__track');
    if (!track) return;

    gsap.to(track, {
      x: '-=50',
      ease: 'none',
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }


  // ─────────────────────────────────────
  // SMOOTH ANCHOR SCROLLING
  // ─────────────────────────────────────
  function initSmoothAnchors() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }


  // ─────────────────────────────────────
  // MAGNETIC BUTTONS (subtle hover effect)
  // ─────────────────────────────────────
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const buttons = document.querySelectorAll('.btn--gold, .btn--outline');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.15,
          y: y * 0.15 - 2, // -2px for subtle lift (replaces CSS hover translateY)
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }


  // ─────────────────────────────────────
  // CURSOR GLOW (custom subtle glow)
  // ─────────────────────────────────────
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let isVisible = false;

    document.addEventListener('mousemove', (e) => {
      if (!isVisible) {
        glow.style.opacity = '1';
        isVisible = true;
      }
      glow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
      isVisible = false;
    });
  }

  // ─────────────────────────────────────
  // INIT
  // ─────────────────────────────────────
  function init() {
    // Check GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.documentElement.classList.add('gsap-failed');
      // Still show content
      document.querySelectorAll('.anim-fade').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.anim-fade').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      // Only init non-animated features
      initMobileNav();
      initHeaderScroll();
      initMasteryTabs();
      initSmoothAnchors();
      return;
    }

    // Initialize everything
    initLenis();
    initMobileNav();
    initHeaderScroll();
    initHeroParallax();
    initHeroEntrance();
    initScrollAnimations();
    initCountUp();
    initMasteryTabs();
    initCareStagger();
    initAdvantages();
    initPromo();
    initCtaParallax();
    initMarqueeScroll();
    initSmoothAnchors();
    initMagneticButtons();
    initCursorGlow();

  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
