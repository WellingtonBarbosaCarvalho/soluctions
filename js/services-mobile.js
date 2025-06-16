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
