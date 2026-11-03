(() => {
  'use strict';

  // Configuração global: Número de telefone do WhatsApp da Heros Food Mcz
  const WHATSAPP_NUMBER = '558281204962';

  // Seleção de elementos do DOM para o menu de navegação responsivo
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const menuOverlay = document.getElementById('overlay-principal');
  const menuLabel = menuButton?.querySelector('.sr-only');

  /**
   * Fecha o menu de navegação lateral.
   * Remove as classes de estado ativo e atualiza os atributos de acessibilidade (ARIA).
   */
  function closeMenu() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');

    if (menuLabel) {
      menuLabel.textContent = 'Abrir menu';
    }
  }

  // Alterna a abertura e o fechamento do menu ao clicar no botão de hambúrguer
  menuButton?.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';

    menuButton.setAttribute('aria-expanded', String(willOpen));
    navigation?.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);

    if (menuLabel) {
      menuLabel.textContent = willOpen ? 'Fechar menu' : 'Abrir menu';
    }
  });

  // Fecha o menu automaticamente quando qualquer link interno da navegação for clicado
  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha o menu caso o usuário clique em qualquer lugar fora da área do menu e do botão principal
  document.addEventListener('click', (event) => {
    const isMenuOpen = navigation?.classList.contains('is-open');

    if (isMenuOpen) {
      const clickedOutsideMenu = !navigation.contains(event.target);
      const clickedOutsideButton = !menuButton.contains(event.target);

      if (clickedOutsideMenu && clickedOutsideButton) {
        closeMenu();
      }
    }
  });

  // Fecha o menu de forma acessível quando o usuário pressiona a tecla 'Escape' (ESC)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton?.focus(); // Devolve o foco do teclado para o botão do menu
    }
  });

  // Configuração dinâmica dos links que direcionam para o WhatsApp comercial
  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    // Recupera a mensagem customizada do HTML através de 'data-message' ou usa uma mensagem padrão
    const message =
      link.dataset.message || 'Olá! Vim pelo site da Heros Food Mcz.';

    // Monta a URL da API oficial do WhatsApp tratando os caracteres especiais da mensagem
    const urlCorreta = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Define as propriedades de segurança para abertura de links externos
    link.href = urlCorreta;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // Intercepta o clique para garantir que a URL gerada dinamicamente seja aberta sem cache obsoleto do HTML
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(urlCorreta, '_blank', 'noopener,noreferrer');
    });
  });

  // Sistema de filtragem por categorias para o cardápio do restaurante
  const filterButtons = document.querySelectorAll('.filter-button');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;

      // Altera o estado visual dos botões de filtro (gerencia qual botão está ativo no momento)
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      // Exibe ou oculta os itens do cardápio baseando-se na categoria selecionada
      menuItems.forEach((item) => {
        item.hidden =
          selected !== 'todos' && item.dataset.category !== selected;
      });
    });
  });

  // Inicializa todos os carrosséis de imagens da página marcados com o atributo [data-carousel]
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    if (!viewport) return;

    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const previous = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');

    let currentIndex = 0;
    let autoPlayTimer = null;

    // Estruturação interna do DOM: Cria a pista horizontal para mover os slides juntos
    const track = document.createElement('div');
    track.className = 'carousel-track';

    // Agrupa e move os slides do HTML original para dentro da nova pista estrutural
    slides.forEach(slide => track.appendChild(slide));
    viewport.appendChild(track);

    /**
     * Inicia a transição automática dos slides a cada 3,5 segundos.
     */
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 3500);
    }

    /**
     * Interrompe o temporizador da transição automática.
     */
    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    // Cria dinamicamente os botões de paginação (pontos/dots) para cada slide existente
    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Exibir produto ${index + 1}`);
      dot.addEventListener('click', () => {
        showSlide(index);
        startAutoPlay(); // Reinicia o contador para evitar pulos bruscos pós-clique
      });
      dotsContainer?.appendChild(dot);
      return dot;
    });

    /**
     * Atualiza a posição do carrossel exibindo o slide correspondente ao índice informado.
     * @param {number} index - Índice do slide que deve ser exibido.
     */
    function showSlide(index) {
      // Cria um comportamento circular garantindo que o índice rotacione sem quebrar o limite do array
      currentIndex = (index + slides.length) % slides.length;

      // Executa o efeito de deslize mudando a posição do eixo X da pista em blocos de 100%
      const amountToMove = currentIndex * -100;
      track.style.transform = `translateX(${amountToMove}%)`;

      // Atualiza o estado de acessibilidade e visual dos slides ativos
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });

      // Atualiza visualmente qual ponto de navegação (dot) corresponde ao slide atual
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    // Ouvintes de eventos para navegação manual via botões "Anterior" e "Próximo"
    previous?.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });

    next?.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });

    // Permite navegar pelo carrossel usando as setas do teclado ao focar no elemento
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

    // Pausa a rotação se o mouse estiver sobre o carrossel e retoma ao retirar
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Ajusta o carrossel se a tela mudar de tamanho ou se o celular mudar de orientação
    window.addEventListener('resize', () => showSlide(currentIndex));

    // Execução inicial padrão do componente
    showSlide(0);
    startAutoPlay();
  });

  // Atualização dinâmica do ano do rodapé da página para direitos autorais
  const year = document.querySelector('#current-year');
    if (year) {
      year.textContent = new Date().getFullYear();
    }

    // Seção de depoimentos/testemunhos: Configuração de efeito de rolagem contínua (Marquee)
    document.addEventListener("DOMContentLoaded", () => {
      const track = document.querySelector(".testimonial-track");
      if (!track) return;

      // Duplica o HTML dos depoimentos para criar o efeito infinito (espelho visual perfeito)
      const trackContent = track.innerHTML;
      track.innerHTML = trackContent + trackContent;

      // Pausa a animação CSS de rolagem quando o usuário segura o dedo na tela em dispositivos mobile
      track.addEventListener("touchstart", () => {
        track.style.animationPlayState = "paused";
      }, { passive: true });

      // Retoma a animação assim que o usuário retira o dedo da tela
      track.addEventListener("touchend", () => {
        track.style.animationPlayState = "running";
      });
    });

    /* -------------------------------------------------------------------------- */
  /* SCROLL REVEAL COM COMPATIBILIDADE MOBILE & FALLBACK                        */
  /* -------------------------------------------------------------------------- */
  
  /**
   * Configura o efeito de revelação (fade-in/fade-up) de elementos conforme o usuário rola a página.
   */
  function setupScrollReveal() {
    // Seleciona todos os elementos que devem ser revelados na rolagem
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!revealElements.length) return;

    // FALLBACK: Se o navegador não suportar IntersectionObserver (ex: navegadores muito antigos),
    // exibe todos os elementos imediatamente para não quebrar a usabilidade.
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    // Configurações de sensibilidade do detector de rolagem
    const observerOptions = {
      root: null, // Usa a própria janela do navegador (viewport) como referência
      /* 
        Usar rootMargin zerado ou levemente positivo no topo/base para garantir 
        que telas com barras de navegação dinâmicas (iOS Safari/Android Chrome)
        detectem o elemento sem cortar.
      */
      rootMargin: '50px 0px 0px 0px',
      threshold: 0.01 // Basta 1% do elemento aparecer na tela para disparar o efeito no mobile
    };

    // Cria o observador que detecta quando os elementos entram na área visível da tela
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Se o elemento entrou na tela, adiciona a classe que dispara a animação CSS
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Remove do observador para rodar a animação apenas uma vez
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      // Otimização: Verifica se o elemento já está na tela logo no primeiro carregamento
      // para evitar que itens do topo da página comecem invisíveis.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el); // Se estiver abaixo da dobra, adiciona ao observador de rolagem
      }
    });
  }

  // Inicializa o Scroll Reveal assim que o documento estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupScrollReveal);
  } else {
    setupScrollReveal();
  }

  /* -------------------------------------------------------------------------- */
  /* EFEITO LIGHTBOX (POP-UP DE PRODUTOS COM TRANSIÇÃO SUAVE)                    */
  /* -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos do modal/lightbox
    const lightbox = document.getElementById('productLightbox');
    const lightboxImg = document.getElementById('lightboxTargetImg');
    const lightboxTitle = document.getElementById('lightboxTargetTitle');
    const closeBtn = document.querySelector('.lightbox-close');
    
    // Seleciona todas as imagens dentro dos cards de produtos do cardápio
    const productImages = document.querySelectorAll('.product-card img');

    /**
     * Abre o Pop-up do produto capturando dinamicamente as informações do card.
     */
    productImages.forEach(img => {
      img.addEventListener('click', () => {
        // Encontra o card pai do produto para capturar o título correto
        const card = img.closest('.product-card');
        const titleText = card.querySelector('h3') ? card.querySelector('h3').innerText : '';

        // Alimenta o modal com a imagem, alt e texto do produto clicado
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.innerText = titleText;

        // Modifica a propriedade display no CSS para tornar o modal renderizável antes da animação
        lightbox.style.display = 'flex';

        // Pequeno delay usando requestAnimationFrame para garantir que o navegador 
        // processe a mudança de display antes de aplicar a opacidade da transição suave
        requestAnimationFrame(() => {
          lightbox.classList.add('is-visible');
          lightbox.setAttribute('aria-hidden', 'false');
        });

        document.body.style.overflow = 'hidden'; // Bloqueia a rolagem do fundo enquanto vê o produto
      });
    });

    /**
     * Fecha o Pop-up de forma limpa, aguardando a animação CSS terminar.
     */
    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Libera a rolagem da página novamente

      // Aguarda os 300ms da transição visual do CSS terminar antes de ocultar o display e limpar os dados
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        lightboxImg.alt = '';
        lightboxTitle.innerText = '';
      }, 300);
    };

    // Evento 1: Fecha ao clicar no botão 'X'
    closeBtn?.addEventListener('click', closeLightbox);

    // Evento 2: Fecha ao clicar na área escura (overlay) fora da imagem
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Evento 3: Fecha de forma acessível ao apertar a tecla 'Escape' (ESC) no teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) {
        closeLightbox();
      }
    });
  });

})();