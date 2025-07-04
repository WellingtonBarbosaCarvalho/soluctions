/**
 * Soluctions S.A - Otimizações Mobile Avançadas
 * Script para melhorar a experiência em dispositivos móveis
 */

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    initMobileOptimizations();
  }
  
  window.addEventListener('resize', handleScreenResize);
  window.addEventListener('orientationchange', handleOrientationChange);
});

function initMobileOptimizations() {
  enhanceHeroSection();
  setupInteractiveCards();
  optimizePerformance();
}

/**
 * Melhora a seção hero para mobile mantendo o visual desktop
 */
function enhanceHeroSection() {
  const cardContainer = document.querySelector('.cyber-card-container');
  const statsCards = document.querySelectorAll('.cyber-stats-card');
  
  if (!cardContainer || !statsCards.length) return;
  
  // Adicionar efeito de perspectiva no container
  cardContainer.style.perspective = '1000px';
  
  // Criar wrapper flutuante para os cards
  let statsWrapper = cardContainer.querySelector('.cyber-stats-wrapper');
  if (!statsWrapper) {
    statsWrapper = document.createElement('div');
    statsWrapper.className = 'cyber-stats-wrapper';
    cardContainer.appendChild(statsWrapper);
  }
  
  // Mover cards para o wrapper e aplicar efeitos
  statsCards.forEach((card, index) => {
    // Adicionar transições suaves
    card.style.transition = 'all 0.3s ease';
    
    // Manter interno dos cards organizado
    const flexContainer = card.querySelector('.flex');
    if (flexContainer) {
      flexContainer.style.display = 'flex';
      flexContainer.style.alignItems = 'center';
      flexContainer.style.gap = '0.75rem';
    }
    
    // Mover para o wrapper
    statsWrapper.appendChild(card);
    
    // Adicionar efeito hover/touch
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(1.05)';
      card.style.zIndex = '30';
    });
    
    card.addEventListener('touchend', () => {
      card.style.transform = '';
      card.style.zIndex = '';
    });
  });
  
  // Adicionar efeito parallax suave na imagem
  setupParallaxEffect(cardContainer);
}

/**
 * Configura efeito parallax para mobile
 */
function setupParallaxEffect(container) {
  const img = container.querySelector('img');
  if (!img) return;
  
  // Efeito de profundidade ao tocar na imagem
  img.addEventListener('touchstart', (e) => {
    e.preventDefault();
    img.style.transform = 'rotateX(15deg) rotateY(-10deg) translateZ(20px)';
  });
  
  img.addEventListener('touchend', () => {
    img.style.transform = 'rotateX(10deg) rotateY(-5deg) translateZ(0)';
  });
  
  // Efeito suave com movimento do device (se disponível)
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      const gamma = e.gamma || 0; // Inclinação left-right
      const beta = e.beta || 0;   // Inclinação front-back
      
      // Limitar valores
      const tiltX = Math.max(-20, Math.min(20, gamma));
      const tiltY = Math.max(-20, Math.min(20, beta));
      
      // Aplicar transformação baseada no movimento
      img.style.transform = `rotateX(${10 + tiltY * 0.1}deg) rotateY(${-5 + tiltX * 0.1}deg) translateZ(0)`;
    });
  }
}

/**
 * Adiciona interatividade aos cards
 */
function setupInteractiveCards() {
  const cards = document.querySelectorAll('.cyber-stats-card');
  
  cards.forEach(card => {
    // Feedback visual ao tocar
    card.addEventListener('touchstart', () => {
      card.classList.add('active');
    });
    
    card.addEventListener('touchend', () => {
      card.classList.remove('active');
    });
    
    // Adicionar animação de entrada
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = '';
    }, 300);
  });
}

/**
 * Otimiza a performance mantendo o visual
 */
function optimizePerformance() {
  // Usar animações mais leves
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      /* Animações otimizadas */
      .cyber-grid, .blob {
        animation-play-state: paused;
      }
      
      /* Reduzir número de partículas */
      #particles-js {
        opacity: 0.3;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Manter apenas animações essenciais para o visual
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 20 },
        "opacity": { "value": 0.2 },
        "size": { "value": 1.5 },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "opacity": 0.2
        },
        "move": { "speed": 0.3 }
      },
      "interactivity": {
        "events": {
          "onhover": { "enable": false },
          "onclick": { "enable": false }
        }
      }
    });
  }
}

/**
 * Manipula mudanças de tamanho de tela
 */
function handleScreenResize() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    initMobileOptimizations();
  } else {
    resetMobileOptimizations();
  }
}

/**
 * Manipula mudanças de orientação
 */
function handleOrientationChange() {
  setTimeout(() => {
    enhanceHeroSection();
  }, 300);
}

/**
 * Reverte otimizações mobile quando em desktop
 */
function resetMobileOptimizations() {
  const cardContainer = document.querySelector('.cyber-card-container');
  const statsCards = document.querySelectorAll('.cyber-stats-card');
  
  if (!cardContainer || !statsCards.length) return;
  
  // Restaurar posições originais
  statsCards.forEach(card => {
    card.style.position = '';
    card.style.transform = '';
    card.style.transition = '';
    
    // Restaurar flex interno
    const flexContainer = card.querySelector('.flex');
    if (flexContainer) {
      flexContainer.style.display = '';
      flexContainer.style.alignItems = '';
      flexContainer.style.gap = '';
    }
  });
}
/**
 * Inicialização do carrossel de serviços para mobile
 */
function initServicesCarousel() {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return;

  const servicesSection = document.querySelector('#services');
  if (!servicesSection) return;

  // Adicionar container do carrossel se não existir
  let carouselContainer = servicesSection.querySelector('.services-mobile-carousel');
  if (!carouselContainer) {
    carouselContainer = document.createElement('div');
    carouselContainer.className = 'services-mobile-carousel';
    
    // Inserir antes do grid
    const grid = servicesSection.querySelector('.grid');
    if (grid) {
      grid.parentNode.insertBefore(carouselContainer, grid);
    }
    
    // Criar estrutura do carrossel
    carouselContainer.innerHTML = `
      <div class="services-carousel-container">
        <div class="services-carousel-wrapper"></div>
        <button class="services-carousel-nav prev">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="services-carousel-nav next">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="services-carousel-dots"></div>
      <button class="view-all-services">
        Ver Todos os Serviços
        <i class="fas fa-arrow-right"></i>
      </button>
    `;
  }

  // Clonar serviços do grid para o carrossel
  const serviceCards = servicesSection.querySelectorAll('.cyber-service-card');
  const carouselWrapper = carouselContainer.querySelector('.services-carousel-wrapper');
  const dotsContainer = carouselContainer.querySelector('.services-carousel-dots');
  
  serviceCards.forEach((card, index) => {
    // Criar slide
    const slide = document.createElement('div');
    slide.className = 'services-carousel-slide';
    if (index === 0) slide.classList.add('active');
    
    // Clonar card para slide
    const cardClone = card.cloneNode(true);
    slide.appendChild(cardClone);
    carouselWrapper.appendChild(slide);
    
    // Criar dot
    const dot = document.createElement('button');
    dot.className = 'services-carousel-dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Variáveis de controle
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Funções de navegação
  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % serviceCards.length;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + serviceCards.length) % serviceCards.length;
    updateCarousel();
  }

  function updateCarousel() {
    // Atualizar slides
    const slides = carouselWrapper.querySelectorAll('.services-carousel-slide');
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    
    // Atualizar dots
    const dots = dotsContainer.querySelectorAll('.services-carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
    
    // Atualizar posição
    const offset = -currentSlide * 90; // 90% width per slide
    carouselWrapper.style.transform = `translateX(${offset}%)`;
  }

  // Event listeners
  const prevButton = carouselContainer.querySelector('.services-carousel-nav.prev');
  const nextButton = carouselContainer.querySelector('.services-carousel-nav.next');
  
  prevButton.addEventListener('click', prevSlide);
  nextButton.addEventListener('click', nextSlide);

  // Touch events
  carouselWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
    startPos = touchStartX;
    currentTranslate = prevTranslate;
    carouselWrapper.style.transition = 'none';
  });

  carouselWrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
    
    const slideWidth = carouselWrapper.offsetWidth * 0.9;
    const offset = -currentSlide * slideWidth;
    const translate = offset + diff;
    
    carouselWrapper.style.transform = `translateX(${translate}px)`;
  });

  carouselWrapper.addEventListener('touchend', (e) => {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    
    // Decidir para qual slide ir baseado no movimento
    if (movedBy < -100 && currentSlide < serviceCards.length - 1) {
      currentSlide++;
    } else if (movedBy > 100 && currentSlide > 0) {
      currentSlide--;
    }
    
    prevTranslate = -currentSlide * carouselWrapper.offsetWidth * 0.9;
    carouselWrapper.style.transition = 'transform 0.3s ease';
    updateCarousel();
  });

  // Botão "Ver Todos"
  const viewAllButton = carouselContainer.querySelector('.view-all-services');
  viewAllButton.addEventListener('click', () => {
    carouselContainer.classList.add('hidden');
    
    // Criar ou mostrar grid completo
    let fullGrid = servicesSection.querySelector('.services-full-grid');
    if (!fullGrid) {
      fullGrid = document.createElement('div');
      fullGrid.className = 'services-full-grid';
      
      // Clonar todos os cards para o grid
      serviceCards.forEach(card => {
        const cardClone = card.cloneNode(true);
        fullGrid.appendChild(cardClone);
      });
      
      servicesSection.appendChild(fullGrid);
    }
    
    fullGrid.classList.add('active');
    
    // Criar botão para voltar ao carrossel
    let backButton = servicesSection.querySelector('.back-to-carousel');
    if (!backButton) {
      backButton = document.createElement('button');
      backButton.className = 'back-to-carousel view-all-services';
      backButton.innerHTML = `
        <i class="fas fa-chevron-left"></i>
        Voltar para o Carrossel
      `;
      backButton.addEventListener('click', () => {
        fullGrid.classList.remove('active');
        carouselContainer.classList.remove('hidden');
        backButton.classList.remove('visible');
      });
      
      fullGrid.parentNode.insertBefore(backButton, fullGrid);
    }
    
    backButton.classList.add('visible');
  });

  // Auto-play opcional
  // setInterval(nextSlide, 5000);
}

// Adicionar à inicialização
document.addEventListener('DOMContentLoaded', () => {
  initServicesCarousel();
});

// Adicionar ao resize handler existente
function handleScreenResize() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    initMobileOptimizations();
    initServicesCarousel(); // Adicionar aqui
  } else {
    resetMobileOptimizations();
  }
}
