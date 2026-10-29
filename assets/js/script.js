(() => {
  'use strict';

  // TODO: confirmar o número completo do WhatsApp antes da publicação.
  const WHATSAPP_NUMBER = '558281204962';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  // Alterado para buscar estritamente pelo ID na raiz da página
  const menuOverlay = document.getElementById('overlay-principal'); 
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
  
  // O resto do seu código (escutadores de clique, carrossel, whatsapp) continua exatamente igual...


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

  // LÓGICA PRINCIPAL: Fechar ao clicar fora do menu ou no overlay
  document.addEventListener('click', (event) => {
    const isMenuOpen = navigation?.classList.contains('is-open');
    
    if (isMenuOpen) {
      // Verifica se o clique ocorreu FORA do menu E FORA do botão de abrir
      const clickedOutsideMenu = !navigation.contains(event.target);
      const clickedOutsideButton = !menuButton.contains(event.target);

      if (clickedOutsideMenu && clickedOutsideButton) {
        closeMenu();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton?.focus();
    }
  });

  // CONFIGURAÇÃO DO WHATSAPP CORRIGIDA E ADAPTADA DO SEU SEGUNDO BLOCO
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const message =
      link.dataset.message || 'Olá! Vim pelo site da Heros Food Mcz.';

    // Montagem da URL corrigida usando a sintaxe exata do seu primeiro bloco funcional
    const urlCorreta = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    link.href = urlCorreta;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Evita conflitos com URLs incorretas gravadas diretamente nas tags href do HTML antigo
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(urlCorreta, '_blank', 'noopener,noreferrer');
    });
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

  // ========================================================
  // LÓGICA DO CARROSSEL REUTILIZÁVEL COM EFEITO DE DESLIZE
  // ========================================================
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    if (!viewport) return;

    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const previous = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');

    let currentIndex = 0;
    let autoPlayTimer = null;

    // Cria a pista (track) interna para alinhar as fotos lado a lado horizontalmente
    const track = document.createElement('div');
    track.className = 'carousel-track';
    
    // Move dinamicamente os slides para dentro do contêiner da pista
    slides.forEach(slide => track.appendChild(slide));
    viewport.appendChild(track);

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 3500); // Mantendo o tempo de rotação do seu código de 3.5 segundos
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Exibir produto ${index + 1}`);
      dot.addEventListener('click', () => {
        showSlide(index);
        startAutoPlay();
      });
      dotsContainer?.appendChild(dot);
      return dot;
    });

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      // Desliza o carrossel horizontalmente usando porcentagem
      const amountToMove = currentIndex * -100;
      track.style.transform = `translateX(${amountToMove}%)`;

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
      startAutoPlay();
    });

    next?.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        showSlide(currentIndex - 1);
        startAutoPlay();
      }
      if (event.key === 'ArrowRight') {
        showSlide(currentIndex + 1);
        startAutoPlay();
      }
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Ajusta o alinhamento em caso de rotação de tela do celular ou redimensionamento
    window.addEventListener('resize', () => showSlide(currentIndex));

    showSlide(0);
    startAutoPlay();
  });

  const year = document.querySelector('#current-year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }
  /* -------------------------------------------------------------------------- */
/* SCROLL REVEAL COM COMPATIBILIDADE MOBILE & FALLBACK                        */
/* -------------------------------------------------------------------------- */
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!revealElements.length) return;

    // Se o navegador não suportar IntersectionObserver, exibe tudo imediatamente
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observerOptions = {
        root: null,
        /* 
           Usar rootMargin zerado ou levemente positivo no topo/base para garantir 
           que telas com barras de navegação dinâmicas (iOS Safari/Android Chrome)
           detectem o elemento sem cortar.
        */
        rootMargin: '50px 0px 0px 0px', 
        threshold: 0.01 // Basta 1% do elemento aparecer para ativar no mobile
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        // Verifica se o elemento já está dentro da tela inicial para não começar invisível
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            el.classList.add('is-visible');
        } else {
            revealObserver.observe(el);
        }
    });
}

// Garante a execução assim que a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollReveal);
} else {
    setupScrollReveal();
}
})();

