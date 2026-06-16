(function () {
  'use strict';

  // ── Elementos ──
  const menuBtn     = document.querySelector('.menu-btn');
  const menu        = document.getElementById('menu');
  const navLinks    = document.querySelectorAll('nav ul li a');
  const backToTopBtn = document.querySelector('.back-to-top');
  const preloader   = document.querySelector('.preloader');
  const nav         = document.querySelector('nav');

  // ── Overlay mobile ──
  const menuOverlay = document.createElement('div');
  menuOverlay.className = 'menu-overlay';
  document.body.appendChild(menuOverlay);

  // ── Menu mobile ──
  function openMenu() {
    menuBtn?.classList.add('active');
    menu?.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuBtn?.classList.remove('active');
    menu?.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', () =>
    menu?.classList.contains('active') ? closeMenu() : openMenu()
  );
  menuOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // ── Scroll suave para âncoras internas ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });

  // ── Header ao rolar ──
  function onScroll() {
    // Header
    nav?.classList.toggle('scrolled', window.scrollY > 50);

    // Botão voltar ao topo
    backToTopBtn?.classList.toggle('visible', window.pageYOffset > 300);

    // Animações
    animateOnScroll();
  }

  // ── Animações ao rolar ──
  function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight / 1.3) {
        el.classList.add('animate');
      }
    });
  }

  // ── Voltar ao topo ──
  backToTopBtn?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Preloader ──
  function removePreloader() {
    if (!preloader) return;
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 500);
  }

  // ── Carrosséis dos Cards ──
  function initCarousels() {
    // Carrossel desativado para deixar cada volume com imagem estática.
    // O código permanece intacto, mas a inicialização não é chamada.
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(function (carousel) {
      const track  = carousel.querySelector('.carousel-track');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots   = carousel.querySelectorAll('.carousel-dot');
      const total  = slides.length;
      if (total === 0) return;

      let current    = 0;
      let intervalId = null;
      let isDragging = false;
      let startX     = 0;
      let dragOffset = 0;

      /* ─ navegação ─ */
      function goTo(index) {
        current = ((index % total) + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
      }

      /* ─ autoplay ─ */
      function startAutoPlay() {
        if (intervalId) return;
        intervalId = setInterval(function () { goTo(current + 1); }, 5000);
      }
      function stopAutoPlay() {
        clearInterval(intervalId);
        intervalId = null;
      }

      startAutoPlay();

      /* ─ arrastar / swipe ─ */
      function onDragStart(x) {
        stopAutoPlay();
        isDragging  = true;
        startX      = x;
        dragOffset  = 0;
        track.classList.add('dragging');
      }
      function onDragMove(x) {
        if (!isDragging) return;
        dragOffset = x - startX;
        track.style.transform =
          'translateX(calc(' + (-current * 100) + '% + ' + dragOffset + 'px))';
      }
      function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');
        const threshold = carousel.offsetWidth * 0.22;
        if      (dragOffset < -threshold) goTo(current + 1);
        else if (dragOffset >  threshold) goTo(current - 1);
        else                              goTo(current);
        dragOffset = 0;
        startAutoPlay();
      }

      /* mouse */
      carousel.addEventListener('mousedown', function (e) { onDragStart(e.clientX); });
      window  .addEventListener('mousemove', function (e) { onDragMove(e.clientX);  });
      window  .addEventListener('mouseup',   onDragEnd);
      carousel.addEventListener('mouseleave', function () { if (isDragging) onDragEnd(); });

      /* touch */
      carousel.addEventListener('touchstart', function (e) {
        onDragStart(e.touches[0].clientX);
      }, { passive: true });
      carousel.addEventListener('touchmove', function (e) {
        onDragMove(e.touches[0].clientX);
      }, { passive: true });
      carousel.addEventListener('touchend', onDragEnd);

      /* dots clicáveis */
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          stopAutoPlay();
          goTo(i);
          startAutoPlay();
        });
      });
    });
  }

  // ── Init ──
  window.addEventListener('load', () => {
    removePreloader();
    animateOnScroll();
    initCarousels(); 
  });

  window.addEventListener('scroll', onScroll, { passive: true });
})();
