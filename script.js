/* ===================================
   JL PROPERTY DEVELOPERS – script.js
   =================================== */

document.addEventListener('DOMContentLoaded', () => {


  /* ===================== SCROLL PROGRESS BAR ===================== */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  /* ===================== PRELOADER ===================== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hide');
      document.body.style.overflow = 'auto';
      triggerHeroAnimations();
    }, 2000);
  });
  document.body.style.overflow = 'hidden';


  /* ===================== CUSTOM CURSOR ===================== */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  (function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .project-card, .assist-card, .blog-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover-ring'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover-ring'));
  });


  /* ===================== NAVBAR SCROLL ===================== */
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    backTop.classList.toggle('visible', window.scrollY > 400);
    updateActiveLink();
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ===================== ACTIVE NAV LINK ===================== */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }


  /* ===================== SMOOTH SCROLL ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // close mobile menu
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ===================== HAMBURGER ===================== */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });


  /* ===================== REVEAL ON SCROLL ===================== */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));


  /* ===================== HERO ANIMATIONS ===================== */
  function triggerHeroAnimations() {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade').forEach(el => {
      el.classList.add('revealed');
    });
  }


  /* ===================== PROJECT FILTER ===================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach((card, i) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 60);
        } else {
          card.style.transition = 'opacity .25s ease';
          card.style.opacity    = '0';
          setTimeout(() => card.classList.add('hidden'), 260);
        }
      });
    });
  });


  /* ===================== TESTIMONIAL SLIDER ===================== */
  const slider   = document.getElementById('testiSlider');
  const dotsWrap = document.getElementById('testiDots');
  const cards    = slider.querySelectorAll('.testi-card');
  let current    = 0;
  let cardsPerView = getCardsPerView();
  let autoPlay;

  function getCardsPerView() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = Math.ceil(cards.length / cardsPerView);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(index) {
    const total = Math.ceil(cards.length / cardsPerView);
    current = (index + total) % total;

    const cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(slider).gap || 32); // gap
    slider.style.transform = `translateX(-${current * cardWidth * cardsPerView}px)`;

    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoPlay = setInterval(() => {
      const total = Math.ceil(cards.length / cardsPerView);
      goTo((current + 1) % total);
    }, 5000);
  }

  buildDots();
  startAuto();

  slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider.addEventListener('mouseleave', startAuto);

  // Swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const total = Math.ceil(cards.length / cardsPerView);
      goTo(diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
    }
  });

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    buildDots();
    goTo(0);
  });


  /* ===================== COUNTER ANIMATION ===================== */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const counterObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => {
        const rawText = counter.textContent.trim();
        const numMatch = rawText.match(/[\d.]+/);
        if (!numMatch) return;
        const target  = parseFloat(numMatch[0]);
        const prefix  = rawText.slice(0, numMatch.index);
        const suffix  = rawText.slice(numMatch.index + numMatch[0].length);
        const isFloat = numMatch[0].includes('.');
        let start     = 0;
        const dur     = 1800;
        const step    = 16;
        const inc     = target / (dur / step);
        const timer   = setInterval(() => {
          start += inc;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          counter.textContent = prefix + (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
        }, step);
      });
      counterObs.disconnect();
    }
  }, { threshold: .5 });

  const heroSection = document.querySelector('.hero');
  if (heroSection) counterObs.observe(heroSection);


  /* ===================== CONTACT FORM ===================== */
  const contactForm = document.getElementById('contactForm');
  const toast       = document.getElementById('toast');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;

    // Simulate network delay
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.disabled  = false;
      contactForm.reset();

      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }, 1500);
  });


  /* ===================== PARALLAX HERO ===================== */
  const heroImg = document.querySelector('.hero-img');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && heroImg) {
    // Wait for zoom animation to finish (14s) before enabling parallax
    let parallaxEnabled = false;
    setTimeout(() => { parallaxEnabled = true; }, 14000);
    window.addEventListener('scroll', () => {
      if (!parallaxEnabled) return;
      if (window.scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    }, { passive: true });
  }


  /* Active nav styles moved to CSS */


  /* ===================== ASSIST CARDS HOVER TILT ===================== */
  document.querySelectorAll('.assist-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform .1s ease';
    });
  });


  /* ===================== BLOG CARD TILT ===================== */
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* Navbar logo styles moved to CSS */

  console.log('%cJL Property Developers', 'font-size:24px; font-weight:bold; color:#c8a96e;');
  console.log('%cWebsite loaded successfully', 'color:#0a1628;');

});
