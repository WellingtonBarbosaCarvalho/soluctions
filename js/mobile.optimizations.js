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
