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

  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 600);
  });

  // Fallback: remove after 4s max
  setTimeout(hidePreloader, 4000);


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

    // Prevent Lenis from interfering with Swiper touch events
    const swiperEl = document.querySelector('.portfolio__swiper');
    if (swiperEl) {
      swiperEl.addEventListener('touchstart', (e) => {
        if (lenis) lenis.stop();
      }, { passive: true });

      swiperEl.addEventListener('touchend', (e) => {
        if (lenis) lenis.start();
      }, { passive: true });
    }

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
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    burger.addEventListener('click', () => {
      const isOpening = !nav.classList.contains('is-open');
      
      burger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      
      // Block scroll
      if (isOpening) {
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
      } else {
        document.body.style.overflow = '';
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
    if (document.querySelector('#scrollHint')) {
      tl.to('#scrollHint', {
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
    const animElements = document.querySelectorAll('.section .anim-fade');

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
              counter.textContent = Math.round(this.targets()[0].innerText);
            }
          });
        }
      });
    });
  }


  // ─────────────────────────────────────
  // SWIPER — Portfolio Carousel
  // ─────────────────────────────────────
  function initPortfolioSwiper() {
    // Wait for Swiper library to load
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper library not loaded');
      return;
    }

    const swiperEl = document.querySelector('.portfolio__swiper');
    if (!swiperEl) {
      console.warn('Portfolio swiper element not found');
      return;
    }

    const currentEl = document.querySelector('.portfolio__current');
    const totalEl = document.querySelector('.portfolio__total');
    const infoCard = document.querySelector('.portfolio__info-content');
    const infoBox = document.querySelector('.portfolio__info');

    function updateInfoCard(slideIndex) {
      if (!infoCard || !infoBox) return;
      const slides = swiperEl.querySelectorAll('.swiper-slide');
      const slide = slides[slideIndex];
      if (!slide) return;

      const title = slide.dataset.title || 'Работа';
      const desc = slide.dataset.desc || '';
      const time = slide.dataset.time || '';
      const complexity = slide.dataset.complexity || '';

      const titleEl = infoCard.querySelector('.portfolio__info-title');
      const descEl = infoCard.querySelector('.portfolio__info-desc');
      const timeEl = infoCard.querySelector('.portfolio__info-detail-value');
      const complexityEl = infoCard.querySelectorAll('.portfolio__info-detail-value')[1];

      // If GSAP available, animate height + fade
      if (typeof gsap !== 'undefined') {
        const oldHeight = infoBox.offsetHeight;

        // Fade out content
        gsap.to(infoCard, { opacity: 0, y: 8, duration: 0.18, ease: 'power1.out' });

        // Apply new content immediately after fade-out starts to measure new height
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (timeEl) timeEl.textContent = time;
        if (complexityEl) complexityEl.textContent = complexity;

        // Measure new height
        infoBox.style.height = 'auto';
        const newHeight = infoBox.offsetHeight;

        // Set back to old height before animating to new
        infoBox.style.height = oldHeight + 'px';

        gsap.to(infoBox, {
          height: newHeight,
          duration: 0.28,
          ease: 'power2.out',
          onComplete: () => {
            infoBox.style.height = 'auto';
          }
        });

        // Fade in content after slight delay
        gsap.to(infoCard, { opacity: 1, y: 0, duration: 0.22, ease: 'power1.out', delay: 0.12 });
      } else {
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (timeEl) timeEl.textContent = time;
        if (complexityEl) complexityEl.textContent = complexity;
      }
    }

    try {
      const swiper = new Swiper(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        centeredSlides: false,
        grabCursor: true,
        speed: 800,
        allowTouchMove: true,
        simulateTouch: true,
        touchRatio: 1,
        touchStartForce: 0,
        resistanceRatio: 0.85,
        touchStartPreventDefault: false,
        touchMoveStopPropagation: false,
        passiveListeners: true,
        mousewheel: false,
        // Always keep navigation enabled on all breakpoints
        watchOverflow: false,
        navigation: {
          prevEl: '.portfolio__arrow--prev',
          nextEl: '.portfolio__arrow--next',
        },
        breakpoints: {
          320: {
            spaceBetween: 12,
          },
          640: {
            spaceBetween: 16,
          },
          768: {
            spaceBetween: 20,
          },
          1024: {
            spaceBetween: 24,
          },
        },
        on: {
          slideChange: function () {
            if (currentEl) {
              currentEl.textContent = String(this.activeIndex + 1).padStart(2, '0');
            }
            updateInfoCard(this.activeIndex);
          },
          init: function () {
            if (totalEl) {
              totalEl.textContent = String(this.slides.length).padStart(2, '0');
            }
            if (currentEl) {
              currentEl.textContent = '01';
            }
            updateInfoCard(0);
          },
          touchStart: function () {
            // Stop Lenis when touching swiper (desktop only; on mobile Lenis is off)
            if (lenis) lenis.stop();
          },
          touchEnd: function () {
            // Resume Lenis after swipe
            if (lenis) lenis.start();
          }
        }
      });

      console.log('Portfolio Swiper initialized successfully');
    } catch (error) {
      console.error('Error initializing Portfolio Swiper:', error);
    }
  }


  // ─────────────────────────────────────
  // SERVICES CARDS STAGGER
  // ─────────────────────────────────────
  function initServicesStagger() {
    const cards = document.querySelectorAll('.services__card');
    if (!cards.length) return;

    gsap.fromTo(cards, {
      opacity: 0,
      y: 60,
      scale: 0.95,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services__grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
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
          y: y * 0.15,
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
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      will-change: left, top;
      transition: opacity 0.3s;
      opacity: 0;
    `;
    document.body.appendChild(glow);

    let isVisible = false;

    document.addEventListener('mousemove', (e) => {
      if (!isVisible) {
        glow.style.opacity = '1';
        isVisible = true;
      }
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
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

    // Initialize everything
    initLenis();
    initMobileNav();
    initHeaderScroll();
    initHeroParallax();
    initHeroEntrance();
    initScrollAnimations();
    initCountUp();
    initServicesStagger();
    initCareStagger();
    initAdvantages();
    initPromo();
    initCtaParallax();
    initMarqueeScroll();
    initSmoothAnchors();
    initMagneticButtons();
    initCursorGlow();

    // Initialize portfolio swiper with slight delay to ensure DOM is ready
    if (typeof Swiper !== 'undefined') {
      initPortfolioSwiper();
    } else {
      // Fallback: retry after Swiper is loaded
      const checkInterval = setInterval(() => {
        if (typeof Swiper !== 'undefined') {
          clearInterval(checkInterval);
          initPortfolioSwiper();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
