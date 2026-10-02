(() => {
  'use strict';

  // TODO: confirmar o número completo do WhatsApp antes da publicação.
  const WHATSAPP_NUMBER = '558281204962';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const menuLabel = menuButton?.querySelector('.sr-only');

  function closeMenu() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');

    if (menuLabel) {
      menuLabel.textContent = 'Abrir menu';
    }
  }

  menuButton?.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';

    menuButton.setAttribute('aria-expanded', String(willOpen));
    navigation?.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);

    if (menuLabel) {
      menuLabel.textContent = willOpen ? 'Fechar menu' : 'Abrir menu';
    }
  });

  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton?.focus();
    }
  });

  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const message =
      link.dataset.message || 'Olá! Vim pelo site da Heros Food Mcz.';

    link.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const filterButtons = document.querySelectorAll('.filter-button');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;

        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      menuItems.forEach((item) => {
        item.hidden =
          selected !== 'todos' && item.dataset.category !== selected;
      });
    });
  });

  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const previous = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');

    let currentIndex = 0;

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');

      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Exibir produto ${index + 1}`);
      dot.addEventListener('click', () => showSlide(index));

      dotsContainer?.appendChild(dot);

      return dot;
    });

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;

        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });

      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentIndex;

        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    previous?.addEventListener('click', () => {
      showSlide(currentIndex - 1);
    });

    next?.addEventListener('click', () => {
      showSlide(currentIndex + 1);
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        showSlide(currentIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        showSlide(currentIndex + 1);
      }
    });

    showSlide(0);
  });

  const year = document.querySelector('#current-year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
