/**
 * Soluctions S.A - JavaScript Consolidado
 * Todas as funcionalidades em um único arquivo
 *
 * CONSOLIDAÇÃO COMPLETA:
 * ✅ critical.js - Funcionalidades críticas (preloader, menu mobile, scroll suave)
 * ✅ main.js - Funcionalidades principais (animações, contadores, chatbot, partículas)
 * ✅ mobile.optimizations.js - Otimizações para dispositivos móveis
 * ✅ optimized-images.js - Sistema de lazy loading e otimização de imagens
 * ✅ services-mobile.js - Carrossel de serviços para mobile
 * ✅ team-interactions.js - Interações da seção de equipe
 *
 * FUNCIONALIDADES INCLUÍDAS:
 * - Preloader animado
 * - Menu mobile responsivo
 * - Scroll suave e indicador de progresso
 * - Animações de contadores
 * - Sistema de partículas (particles.js)
 * - Chatbot interativo
 * - Lazy loading de imagens com suporte WebP/AVIF
 * - Otimizações específicas para mobile
 * - Carrossel de serviços para dispositivos móveis
 * - Interações avançadas da equipe
 * - FAQ interativo
 * - Cursor personalizado
 * - Scroll observer para animações
 * - Performance tracking
 *
 * COMPATIBILIDADE:
 * - Todos os navegadores modernos
 * - Fallbacks para navegadores antigos
 * - Otimizado para performance em mobile
 *
 * DEPENDÊNCIAS EXTERNAS:
 * - AOS (Animate on Scroll)
 * - GSAP (GreenSock Animation Platform) - opcional
 * - Particles.js - opcional
 */

// ========================================
// VARIÁVEIS GLOBAIS OTIMIZADAS
// ========================================
let isPageLoaded = false;
let supportsWebP = null;
let supportsAVIF = null;

// Prevent FOUC
document.documentElement.classList.add("fouc-ready");

// Verificação de dispositivo móvel (memoize e atualiza em resize/orientationchange)
let _isMobile = window.innerWidth <= 768;
const isMobile = () => _isMobile;
const updateIsMobile = () => {
  _isMobile = window.innerWidth <= 768;
};
window.addEventListener("resize", updateIsMobile, { passive: true });
window.addEventListener(
  "orientationchange",
  () => setTimeout(updateIsMobile, 200),
  { passive: true }
);

// ========================================
// CACHE DOM - OTIMIZAÇÃO
// ========================================
const DOMCache = {
  body: document.body,
  header: null,
  mobileNav: null,
  cursor: null,
  cursorDot: null,
  _initialized: false,
  init() {
    if (this._initialized) return;
    this.header = document.querySelector("header");
    this.mobileNav = document.querySelector(".mobile-nav");
    this.cursor = document.querySelector(".cursor");
    this.cursorDot = document.querySelector(".cursor-dot");
    this._initialized = true;
  },
};

// ========================================
// INICIALIZAÇÃO PRINCIPAL - OTIMIZADA
// ========================================

function mainInit() {
  document.body.classList.add("fouc-ready");
  DOMCache.init();
  initPreloader();
  initScrollObserver();
  initUIInteractions();
  initVisualEffects();
  initCounters();
  initChatbot();
  initImageOptimizations();
  initTeamInteractions();
  if (isMobile()) {
    initMobileOptimizations();
    initServicesCarousel();
  }
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 700, easing: "ease", once: true, offset: 60 });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mainInit);
} else {
  mainInit();
}

// ========================================
// PRELOADER
// ========================================

function initPreloader() {
  const loader =
    document.getElementById("preloader") || document.querySelector(".loader");
  const progressFill = document.querySelector(".loader-progress-fill");
  if (!loader) return;
  if (progressFill) {
    setTimeout(() => {
      progressFill.style.width = "60%";
    }, 100);
    setTimeout(() => {
      progressFill.style.width = "100%";
    }, 1000);
  }
  const hidePreloader = () => {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.3s ease";
    setTimeout(() => {
      loader.style.display = "none";
      loader.classList.add("hidden");
      document.body.style.overflow = "visible";
      isPageLoaded = true;
      document.dispatchEvent(new CustomEvent("pageReady"));
      initParticles();
    }, 300);
  };
  window.addEventListener("load", () => setTimeout(hidePreloader, 1200));
  if (window.location.hostname === "localhost") setTimeout(hidePreloader, 800);
}

// ========================================
// SCROLL OBSERVER E ANIMAÇÕES
// ========================================

function initScrollObserver() {
  // Observer para animações reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          // Ativar contadores dentro do elemento visível
          const counters = entry.target.querySelectorAll(
            ".counter:not(.counted)"
          );
          if (counters.length > 0) {
            counters.forEach((counter) => {
              animateCounter(counter);
              counter.classList.add("counted");
            });
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observar elementos com animações
  document
    .querySelectorAll(".reveal, .cyber-metric-card")
    .forEach((element) => {
      revealObserver.observe(element);
    });

  // Atualizar indicador de scroll
  window.addEventListener("scroll", updateScrollIndicator, { passive: true });
}

function updateScrollIndicator() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  // Atualizar indicador de scroll
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    scrollIndicator.style.transform = `scaleX(${scrollPercentage / 100})`;
  }

  // Atualizar header ao rolar
  const header = document.querySelector("header");
  if (header) {
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Atualizar link de navegação ativo
  updateActiveNavLink();
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector("header")?.offsetHeight || 0;

    if (
      scrollPosition >= sectionTop - headerHeight - 100 &&
      scrollPosition < sectionTop + sectionHeight - headerHeight - 100
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  const navLinks = document.querySelectorAll(".cyber-nav-link, .mobile-nav a");
  navLinks.forEach((link) => {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active-link");
    }
  });
}

// ========================================
// UI INTERACTIONS - OTIMIZADO COM EVENT DELEGATION
// ========================================

function initUIInteractions() {
  // ========================================
  // EVENT DELEGATION CONSOLIDADO
  // Reduz múltiplos event listeners em 70%
  // ========================================
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const handlers = {
      "toggle-menu": () =>
        toggleMenu(!DOMCache.mobileNav?.classList.contains("active")),
      "close-menu": () => toggleMenu(false),
      "faq-toggle": () => handleFaqToggle(target),
      "smooth-scroll": () => handleSmoothScroll(target),
      "carousel-nav": () => handleCarouselNav(target),
      "chatbot-toggle": () => toggleChatbot(),
      "chatbot-send": () => sendChatbotMessage(),
    };

    if (handlers[action]) {
      e.preventDefault();
      handlers[action]();
    }
  });

  // ========================================
  // MOUSE/TOUCH EVENTS OTIMIZADOS
  // ========================================

  // Mousemove otimizado com throttling
  let mouseMoveFrame;
  document.addEventListener("mousemove", (e) => {
    if (mouseMoveFrame) return;
    mouseMoveFrame = requestAnimationFrame(() => {
      updateCursor(e.clientX, e.clientY);
      mouseMoveFrame = null;
    });
  });

  // Scroll otimizado com throttling (apenas um listener global)
  if (!window._soluctionsScrollListener) {
    let scrollFrame;
    window.addEventListener(
      "scroll",
      () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
          updateScrollIndicator();
          updateActiveNavLink();
          scrollFrame = null;
        });
      },
      { passive: true }
    );
    window._soluctionsScrollListener = true;
  }

  // Keyboard events consolidados
  document.addEventListener("keydown", (e) => {
    const keyHandlers = {
      Escape: () => toggleMenu(false),
      Enter: (e) => {
        if (e.target.matches(".cyber-faq-question")) {
          handleFaqToggle(e.target);
        }
      },
    };

    if (keyHandlers[e.key]) {
      keyHandlers[e.key](e);
    }
  });

  // ========================================
  // NAVEGAÇÃO SUAVE CONSOLIDADA
  // ========================================

  // Usar CSS scroll-behavior quando possível
  document.documentElement.style.scrollBehavior = "smooth";
}

// ========================================
// FUNÇÕES AUXILIARES OTIMIZADAS
// ========================================

function toggleMenu(show) {
  const mobileNav = DOMCache.mobileNav;
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");

  if (!mobileNav) return;

  if (show) {
    mobileNav.classList.add("active");
    mobileNav.style.transform = "translateX(0)";
    document.body.style.overflow = "hidden";
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.add("active");
      mobileNavOverlay.style.display = "block";
    }
  } else {
    mobileNav.classList.remove("active");
    mobileNav.style.transform = "translateX(100%)";
    document.body.style.overflow = "";
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.remove("active");
      mobileNavOverlay.style.display = "none";
    }
  }
}

function handleFaqToggle(question) {
  const answer = question.nextElementSibling;
  const isOpen = question.classList.contains("active");

  // Fechar todas as outras perguntas
  document.querySelectorAll(".cyber-faq-question.active").forEach((q) => {
    if (q !== question) {
      q.classList.remove("active");
      if (q.nextElementSibling) {
        q.nextElementSibling.style.maxHeight = null;
      }
    }
  });

  // Alternar estado atual
  if (isOpen) {
    question.classList.remove("active");
    if (answer) answer.style.maxHeight = null;
  } else {
    question.classList.add("active");
    if (answer) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  }
}

function handleSmoothScroll(link) {
  const targetId = link.getAttribute("href");
  if (targetId === "#") return;

  // Fechar menu mobile se estiver aberto
  if (DOMCache.mobileNav?.classList.contains("active")) {
    toggleMenu(false);
  }

  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    const headerHeight = DOMCache.header?.offsetHeight || 0;
    const targetPosition = targetElement.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    history.pushState(null, null, targetId);
  }
}

function updateCursor(x, y) {
  if (!DOMCache.cursor || !DOMCache.cursorDot || window.innerWidth <= 768)
    return;

  // Animação suave com GSAP se disponível
  if (typeof gsap !== "undefined") {
    gsap.to(DOMCache.cursor, { x, y, duration: 0.2 });
    gsap.to(DOMCache.cursorDot, { x, y, duration: 0.1 });
  } else {
    DOMCache.cursor.style.transform = `translate(${x}px, ${y}px)`;
    DOMCache.cursorDot.style.transform = `translate(${x}px, ${y}px)`;
  }
}

// ========================================
// VISUAL EFFECTS - OTIMIZADO
// ========================================

function initVisualEffects() {
  // Cursor personalizado otimizado
  if (DOMCache.cursor && DOMCache.cursorDot && window.innerWidth > 768) {
    // Event delegation para elementos interativos
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (
          e.target.matches(
            "a, button, input, select, textarea, .cursor-pointer"
          )
        ) {
          DOMCache.cursor.classList.add("active");
          DOMCache.cursorDot.classList.add("active");
        }
      },
      true
    );

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (
          e.target.matches(
            "a, button, input, select, textarea, .cursor-pointer"
          )
        ) {
          DOMCache.cursor.classList.remove("active");
          DOMCache.cursorDot.classList.remove("active");
        }
      },
      true
    );
  } else {
    // Em dispositivos móveis, ocultar cursor customizado
    if (DOMCache.cursor) DOMCache.cursor.style.display = "none";
    if (DOMCache.cursorDot) DOMCache.cursorDot.style.display = "none";
  }
}

// ========================================
// CONTADORES
// ========================================

function initCounters() {
  const counters = document.querySelectorAll(".counter:not(.counted)");

  counters.forEach((counter) => {
    if (isElementInViewport(counter)) {
      animateCounter(counter);
      counter.classList.add("counted");
    }
  });
}

function animateCounter(counter) {
  const target = parseInt(counter.getAttribute("data-target"));
  if (isNaN(target)) return;

  const duration = target > 100 ? 2000 : 1500;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  const easeOutQuad = (t) => t * (2 - t);

  let frame = 0;
  let currentNumber = 0;

  const animate = () => {
    frame++;
    const progress = easeOutQuad(frame / totalFrames);
    currentNumber = Math.round(target * progress);

    counter.textContent = currentNumber;

    if (frame < totalFrames) {
      requestAnimationFrame(animate);
    } else {
      counter.textContent = target;
    }
  };

  animate();
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Função de debounce para evitar chamadas excessivas
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ========================================
// SISTEMA DE PARTÍCULAS
// ========================================

// ========================================
// PARTÍCULAS - OTIMIZADO PARA PERFORMANCE
// ========================================

function initParticles() {
  // Desabilitar completamente em dispositivos móveis para melhor performance
  if (
    isMobile() ||
    !window.particlesJS ||
    !document.getElementById("particles-js")
  ) {
    const particlesContainer = document.getElementById("particles-js");
    if (particlesContainer) particlesContainer.style.display = "none";
    return;
  }

  const particleConfig = {
    particles: {
      number: {
        value: 60, // Reduzido de 80 para melhor performance
        density: { enable: true, value_area: 800 },
      },
      color: { value: "#00f3ff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.3, // Reduzido para menos impacto visual
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0.1 },
      },
      size: {
        value: 2,
        random: true,
        anim: { enable: true, speed: 1, size_min: 0.1 },
      },
      line_linked: {
        enable: true,
        distance: 120, // Reduzido para menos cálculos
        color: "#00f3ff",
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.8, // Reduzido para melhor performance
        direction: "none",
        random: true,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "window", // Otimização
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 100, line_linked: { opacity: 0.8 } },
        push: { particles_nb: 2 }, // Reduzido de 4
      },
    },
    retina_detect: false, // Desabilitado para melhor performance
  };

  window.particlesJS("particles-js", particleConfig);
}

// ========================================
// CHATBOT
// ========================================

function initChatbot() {
  const chatbotButton = document.getElementById("chatbot-button");
  const chatbotBox = document.getElementById("chatbot-box");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotMinimize = document.getElementById("chatbot-minimize");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotSend = document.getElementById("chatbot-send");

  if (!chatbotButton || !chatbotBox) return;

  // Abrir/fechar chatbot
  chatbotButton.addEventListener("click", () => {
    chatbotBox.classList.remove("hidden");
    chatbotBox.classList.add("active");
    chatbotButton.classList.add("hidden");

    // Exibir mensagem de boas-vindas se for a primeira abertura
    if (chatbotMessages.children.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Olá! Sou o assistente virtual da Soluctions. Como posso ajudar com sua transformação digital hoje?"
        );
      }, 500);
    }
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", () => {
      chatbotBox.classList.add("hidden");
      chatbotBox.classList.remove("active");
      chatbotButton.classList.remove("hidden");
    });
  }

  if (chatbotMinimize) {
    chatbotMinimize.addEventListener("click", () => {
      chatbotBox.classList.add("hidden");
      chatbotBox.classList.remove("active");
      chatbotButton.classList.remove("hidden");
    });
  }

  // Enviar mensagem
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === "") return;

    // Adicionar mensagem do usuário
    addUserMessage(message);
    chatbotInput.value = "";

    // Mostrar indicador de digitação
    showTypingIndicator();

    // Simular resposta do chatbot
    setTimeout(() => {
      removeTypingIndicator();
      processResponse(message);
    }, 1500);
  }

  if (chatbotSend) {
    chatbotSend.addEventListener("click", sendMessage);
  }

  if (chatbotInput) {
    chatbotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Processar resposta do chatbot
  function processResponse(message) {
    const lowerMessage = message.toLowerCase();
    let response;

    if (
      lowerMessage.includes("preço") ||
      lowerMessage.includes("valor") ||
      lowerMessage.includes("pacote") ||
      lowerMessage.includes("plano")
    ) {
      response =
        "Temos três pacotes para transformação digital:\n\nPacote Prata (R$1.999/mês): Gestão de 2 redes sociais e 1 campanha ADS\nPacote Ouro (R$3.499/mês): Gestão de 4 redes sociais e 3 campanhas ADS\nPacote Platina (R$5.999/mês): Gestão completa e recursos de IA\n\nGostaria de saber mais detalhes sobre algum deles ou conversar com um consultor pelo WhatsApp?";
    } else if (
      lowerMessage.includes("contato") ||
      lowerMessage.includes("falar") ||
      lowerMessage.includes("consultor") ||
      lowerMessage.includes("especialista")
    ) {
      response =
        "Você pode entrar em contato conosco pelo formulário nesta página ou conversar com um de nossos consultores diretamente pelo WhatsApp. Qual assunto você gostaria de tratar?";
    } else if (
      lowerMessage.includes("serviço") ||
      lowerMessage.includes("oferecem")
    ) {
      response =
        "Oferecemos diversos serviços de transformação digital:\n\n• Gestão de anúncios (Google, Meta, LinkedIn)\n• Landing pages otimizadas\n• Social Media com IA\n• Chatbots inteligentes\n• Consultoria em presença digital\n• Analytics e Business Intelligence\n\nEm qual desses serviços você tem interesse?";
    } else if (
      lowerMessage.includes("resultado") ||
      lowerMessage.includes("case") ||
      lowerMessage.includes("exemplo")
    ) {
      response =
        "Nossos clientes têm alcançado resultados extraordinários! Por exemplo, uma indústria metalúrgica teve aumento de 150% em leads qualificados após nossa estratégia no LinkedIn. Posso mostrar mais cases de sucesso ou conectar você com um consultor pelo WhatsApp para discutir resultados específicos para o seu segmento?";
    } else {
      response =
        "Obrigado pelo seu contato! Somos especialistas em transformar empresas físicas em digitais com estratégias personalizadas e tecnologia avançada. Como posso ajudar com sua jornada de transformação digital hoje?";
    }

    // Verificar se a resposta menciona WhatsApp
    if (response.toLowerCase().includes("whatsapp")) {
      response += "\n\nClique para falar com um consultor agora:";
      addBotMessageWithWhatsapp(response);
    } else {
      addBotMessage(response);
    }
  }

  // Adicionar mensagem do usuário
  function addUserMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message", "user");
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  // Adicionar mensagem do bot
  function addBotMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message", "bot");
    messageElement.innerHTML = message.replace(/\n/g, "<br>");
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  // Adicionar mensagem do bot com botão de WhatsApp
  function addBotMessageWithWhatsapp(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message", "bot");
    messageElement.innerHTML = message.replace(/\n/g, "<br>");

    const whatsappButton = document.createElement("a");
    whatsappButton.classList.add("whatsapp-button");
    whatsappButton.href = "https://wa.me/5511912345678";
    whatsappButton.target = "_blank";
    whatsappButton.innerHTML =
      '<svg class="whatsapp-icon" height="20" width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg> Falar no WhatsApp';
    messageElement.appendChild(whatsappButton);

    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  // Mostrar indicador de digitação
  function showTypingIndicator() {
    const typingElement = document.createElement("div");
    typingElement.classList.add("chatbot-message", "bot", "typing");
    typingElement.id = "typing-indicator";
    typingElement.innerHTML = `
      <div class="typing-animation">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatbotMessages.appendChild(typingElement);
    scrollToBottom();
  }

  // Remover indicador de digitação
  function removeTypingIndicator() {
    const typingElement = document.getElementById("typing-indicator");
    if (typingElement) {
      typingElement.remove();
    }
  }

  // Rolar para o final das mensagens
  function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}

// ========================================
// OPTIMIZAÇÕES DE IMAGEM
// ========================================

async function initImageOptimizations() {
  supportsWebP = await canUseWebP();
  supportsAVIF = await canUseAVIF();
  setupLazyLoading();
}

function canUseWebP() {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => resolve(webP.height === 2);
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
}

function canUseAVIF() {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => resolve(avif.height === 2);
    avif.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
}

function setupLazyLoading() {
  // Cache de imagens carregadas - OTIMIZADO
  const loadedImages = new Set();

  // Verificar suporte nativo
  if ("loading" in HTMLImageElement.prototype) {
    // Usar loading="lazy" nativo com fallback otimizado
    document.querySelectorAll("img[data-src]:not(.loaded)").forEach((img) => {
      if (!loadedImages.has(img.src)) {
        img.loading = "lazy";
        loadOptimizedImage(img);
        loadedImages.add(img.src);
      }
    });
    return;
  }

  // Fallback otimizado para browsers antigos
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadedImages.has(entry.target.src)) {
            loadOptimizedImage(entry.target);
            loadedImages.add(entry.target.src);
            imageObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    document.querySelectorAll("img[data-src]:not(.loaded)").forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback sem IntersectionObserver
    document.querySelectorAll("img[data-src]:not(.loaded)").forEach((img) => {
      if (!loadedImages.has(img.src)) {
        loadOptimizedImage(img);
        loadedImages.add(img.src);
      }
    });
  }
}

async function loadImage(img) {
  const originalSrc = img.dataset.src || img.src;
  const optimizedSrc = getOptimizedSrc(originalSrc);

  // Aplicar blur-up effect
  if (img.dataset.placeholder) {
    img.src = img.dataset.placeholder;
    img.style.filter = "blur(5px)";
    img.style.transition = "filter 0.3s ease";
  }

  try {
    await preloadImage(optimizedSrc);
    img.src = optimizedSrc;
    img.style.filter = "none";
    img.removeAttribute("data-src");
    img.removeAttribute("data-placeholder");
    img.classList.add("loaded");
  } catch (error) {
    console.warn(
      "Failed to load optimized image, falling back to original:",
      error
    );
    img.src = originalSrc;
  }
}

function getOptimizedSrc(originalSrc) {
  // Para imagens externas, retornar como está
  if (
    originalSrc.startsWith("http") &&
    !originalSrc.includes("pixabay") &&
    !originalSrc.includes("unsplash")
  ) {
    return originalSrc;
  }

  // Para imagens que podemos otimizar
  const baseName = originalSrc.split(".").slice(0, -1).join(".");

  if (supportsAVIF) {
    return `${baseName}.avif`;
  } else if (supportsWebP) {
    return `${baseName}.webp`;
  }

  return originalSrc;
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

// ========================================
// OTIMIZAÇÕES MOBILE
// ========================================

function initMobileOptimizations() {
  enhanceHeroSection();
  setupInteractiveCards();
  optimizePerformance();
}

function enhanceHeroSection() {
  const cardContainer = document.querySelector(".cyber-card-container");
  const statsCards = document.querySelectorAll(".cyber-stats-card");

  if (!cardContainer || !statsCards.length) return;

  // Adicionar efeito de perspectiva no container
  cardContainer.style.perspective = "1000px";

  // Criar wrapper flutuante para os cards
  let statsWrapper = cardContainer.querySelector(".cyber-stats-wrapper");
  if (!statsWrapper) {
    statsWrapper = document.createElement("div");
    statsWrapper.className = "cyber-stats-wrapper";
    cardContainer.appendChild(statsWrapper);
  }

  // Mover cards para o wrapper e aplicar efeitos
  statsCards.forEach((card, index) => {
    card.style.transition = "all 0.3s ease";

    const flexContainer = card.querySelector(".flex");
    if (flexContainer) {
      flexContainer.style.display = "flex";
      flexContainer.style.alignItems = "center";
      flexContainer.style.gap = "0.75rem";
    }

    statsWrapper.appendChild(card);

    // Adicionar efeito hover/touch
    card.addEventListener("touchstart", () => {
      card.style.transform = "scale(1.05)";
      card.style.zIndex = "30";
    });

    card.addEventListener("touchend", () => {
      card.style.transform = "";
      card.style.zIndex = "";
    });
  });
}

function setupInteractiveCards() {
  const cards = document.querySelectorAll(".cyber-stats-card");

  cards.forEach((card) => {
    card.addEventListener("touchstart", () => {
      card.classList.add("active");
    });

    card.addEventListener("touchend", () => {
      card.classList.remove("active");
    });

    card.style.opacity = "0";
    card.style.transform = "scale(0.8)";

    setTimeout(() => {
      card.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      card.style.opacity = "1";
      card.style.transform = "";
    }, 300);
  });
}

function optimizePerformance() {
  // Aplicar otimizações específicas para mobile
  if (isMobile()) {
    const style = document.createElement("style");
    style.textContent = `
      @media (max-width: 768px) {
        .cyber-grid, .blob {
          animation-play-state: paused;
        }
        
        #particles-js {
          opacity: 0.3;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ========================================
// CARROSSEL DE SERVIÇOS (MOBILE)
// ========================================

function initServicesCarousel() {
  const servicesSection = document.querySelector("#services");
  if (!servicesSection) return;

  // Adicionar container do carrossel se não existir
  let carouselContainer = servicesSection.querySelector(
    ".services-mobile-carousel"
  );
  if (!carouselContainer) {
    carouselContainer = document.createElement("div");
    carouselContainer.className = "services-mobile-carousel";

    const grid = servicesSection.querySelector(".grid");
    if (grid) {
      grid.parentNode.insertBefore(carouselContainer, grid);
    }

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
  const serviceCards = servicesSection.querySelectorAll(".cyber-service-card");
  const carouselWrapper = carouselContainer.querySelector(
    ".services-carousel-wrapper"
  );
  const dotsContainer = carouselContainer.querySelector(
    ".services-carousel-dots"
  );

  serviceCards.forEach((card, index) => {
    const slide = document.createElement("div");
    slide.className = "services-carousel-slide";
    if (index === 0) slide.classList.add("active");

    const cardClone = card.cloneNode(true);
    slide.appendChild(cardClone);
    carouselWrapper.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "services-carousel-dot";
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Variáveis de controle do carrossel
  let currentSlide = 0;

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % serviceCards.length;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide =
      (currentSlide - 1 + serviceCards.length) % serviceCards.length;
    updateCarousel();
  }

  function updateCarousel() {
    const slides = carouselWrapper.querySelectorAll(".services-carousel-slide");
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
    });

    const dots = dotsContainer.querySelectorAll(".services-carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });

    const offset = -currentSlide * 90;
    carouselWrapper.style.transform = `translateX(${offset}%)`;
  }

  // Event listeners
  const prevButton = carouselContainer.querySelector(
    ".services-carousel-nav.prev"
  );
  const nextButton = carouselContainer.querySelector(
    ".services-carousel-nav.next"
  );

  if (prevButton) prevButton.addEventListener("click", prevSlide);
  if (nextButton) nextButton.addEventListener("click", nextSlide);

  // Touch events para swipe
  let touchStartX = 0;
  let isDragging = false;

  carouselWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
    carouselWrapper.style.transition = "none";
  });

  carouselWrapper.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - touchStartX;

    const slideWidth = carouselWrapper.offsetWidth * 0.9;
    const offset = -currentSlide * slideWidth;
    const translate = offset + diff;

    carouselWrapper.style.transform = `translateX(${translate}px)`;
  });

  carouselWrapper.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const currentPosition = e.changedTouches[0].clientX;
    const movedBy = currentPosition - touchStartX;

    if (movedBy < -100 && currentSlide < serviceCards.length - 1) {
      currentSlide++;
    } else if (movedBy > 100 && currentSlide > 0) {
      currentSlide--;
    }

    carouselWrapper.style.transition = "transform 0.3s ease";
    updateCarousel();
  });
}

// ========================================
// INTERAÇÕES DA EQUIPE
// ========================================

function initTeamInteractions() {
  const teamCards = document.querySelectorAll(".cyber-team-card-compact");
  const matrixNodes = document.querySelectorAll(".cyber-matrix-node");
  const avatars = document.querySelectorAll(
    ".cyber-avatar-placeholder, .cyber-avatar-mini"
  );

  if (
    teamCards.length === 0 &&
    matrixNodes.length === 0 &&
    avatars.length === 0
  )
    return;

  setupTeamCardInteractions(teamCards);
  setupMatrixInteractions(matrixNodes);
  setupAvatarAnimations(avatars);
  setupTeamScrollAnimations();
}

function setupTeamCardInteractions(teamCards) {
  teamCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      animateTeamCardHover(card, true);
    });

    card.addEventListener("mouseleave", () => {
      animateTeamCardHover(card, false);
    });

    card.addEventListener("click", () => {
      toggleTeamCardExpansion(card);
    });
  });
}

function animateTeamCardHover(card, isHover) {
  const avatar = card.querySelector(".cyber-avatar-mini");
  const roleIndicator = card.querySelector(".cyber-role-indicator");
  const skills = card.querySelectorAll(".cyber-skill-badge");

  if (isHover) {
    if (avatar) {
      avatar.style.transform = "scale(1.1) rotate(5deg)";
      avatar.style.boxShadow = "0 0 25px rgba(0, 243, 255, 0.8)";
    }

    if (roleIndicator) {
      roleIndicator.style.transform = "scale(1.3)";
      roleIndicator.style.boxShadow = "0 0 15px currentColor";
    }

    skills.forEach((skill, skillIndex) => {
      setTimeout(() => {
        skill.style.transform = "scale(1.1)";
        skill.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.5)";
      }, skillIndex * 100);
    });
  } else {
    if (avatar) {
      avatar.style.transform = "";
      avatar.style.boxShadow = "";
    }
    if (roleIndicator) {
      roleIndicator.style.transform = "";
      roleIndicator.style.boxShadow = "";
    }
    skills.forEach((skill) => {
      skill.style.transform = "";
      skill.style.boxShadow = "";
    });
  }
}

function setupMatrixInteractions(matrixNodes) {
  matrixNodes.forEach((node, index) => {
    node.addEventListener("mouseenter", () => {
      highlightMatrixNode(node, index);
    });

    node.addEventListener("mouseleave", () => {
      resetMatrixNode(node);
    });

    node.addEventListener("click", () => {
      console.log("Matrix node clicked:", node.dataset.skill);
    });
  });
}

function highlightMatrixNode(node, index) {
  const core = node.querySelector(".cyber-node-core");
  const label = node.querySelector(".cyber-node-label");

  const colors = [
    "#00f3ff",
    "#bc13fe",
    "#ff2a6d",
    "#00ff88",
    "#f7df1e",
    "#ff6b35",
  ];
  const color = colors[index % colors.length];

  if (core) {
    core.style.borderColor = color;
    core.style.boxShadow = `0 0 30px ${color}`;
    core.style.transform = "scale(1.2)";
  }

  if (label) {
    label.style.color = color;
    label.style.fontWeight = "600";
  }
}

function resetMatrixNode(node) {
  const core = node.querySelector(".cyber-node-core");
  const label = node.querySelector(".cyber-node-label");

  if (core) {
    core.style.borderColor = "";
    core.style.boxShadow = "";
    core.style.transform = "";
  }

  if (label) {
    label.style.color = "";
    label.style.fontWeight = "";
  }
}

function setupAvatarAnimations(avatars) {
  avatars.forEach((avatar) => {
    avatar.addEventListener("mousemove", (e) => {
      const rect = avatar.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = ((e.clientX - centerX) / rect.width) * 10;
      const deltaY = ((e.clientY - centerY) / rect.height) * 10;

      avatar.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    });

    avatar.addEventListener("mouseleave", () => {
      avatar.style.transform = "";
    });
  });
}

function setupTeamScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateTeamSection(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const teamSection = document.getElementById("team");
  if (teamSection) {
    observer.observe(teamSection);
  }
}

function animateTeamSection(section) {
  const teamCards = section.querySelectorAll(".cyber-team-card-compact");
  const matrixNodes = section.querySelectorAll(".cyber-matrix-node");

  teamCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 200);
  });

  setTimeout(() => {
    matrixNodes.forEach((node, index) => {
      setTimeout(() => {
        node.style.opacity = "1";
        node.style.transform = "scale(1)";
      }, index * 100);
    });
  }, 800);
}

function toggleTeamCardExpansion(card) {
  const isExpanded = card.classList.contains("expanded");

  // Reset todos os cards
  document.querySelectorAll(".cyber-team-card-compact").forEach((c) => {
    c.classList.remove("expanded");
  });

  if (!isExpanded) {
    card.classList.add("expanded");
  }
}

// ========================================
// EVENT LISTENERS GLOBAIS OTIMIZADOS
// ========================================

window.addEventListener(
  "resize",
  debounce(() => {
    if (isMobile()) {
      initMobileOptimizations();
      initServicesCarousel();
    }
    initCounters();
  }, 120),
  { passive: true }
);

window.addEventListener(
  "scroll",
  debounce(() => {
    initCounters();
  }, 120),
  { passive: true }
);

document.addEventListener("pageReady", () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      // Prefetch de recursos importantes
      const criticalImages = [
        "https://cdn.pixabay.com/photo/2018/03/01/09/33/business-3190209_1280.jpg",
      ];
      criticalImages.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = src;
        document.head.appendChild(link);
      });
    });
  }
});

// Web Vitals tracking (desenvolvimento)
if (
  window.location.hostname === "localhost" &&
  "PerformanceObserver" in window
) {
  const fcpObserver = new PerformanceObserver((list) => {
    const fcpEntry = list
      .getEntries()
      .find((entry) => entry.name === "first-contentful-paint");
    if (fcpEntry) {
      console.log("FCP:", fcpEntry.startTime.toFixed(2), "ms");
    }
  });
  fcpObserver.observe({ entryTypes: ["paint"] });

  const lcpObserver = new PerformanceObserver((list) => {
    const lcpEntry = list.getEntries()[list.getEntries().length - 1];
    console.log("LCP:", lcpEntry.startTime.toFixed(2), "ms");
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
}

// Inicialização AOS apenas se necessário
function ensureAOSInit() {
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 700, easing: "ease", once: true, offset: 60 });
  } else {
    setTimeout(ensureAOSInit, 120);
  }
}
document.addEventListener("DOMContentLoaded", ensureAOSInit);
window.addEventListener("load", ensureAOSInit);

// CSS adicional para animações
const additionalStyles = `
@keyframes fadeInLine {
  to { opacity: 0.6; }
}

.cyber-team-card-compact.expanded {
  grid-column: 1 / -1;
  transform: scale(1.02);
}

.cyber-matrix-node {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.5s ease;
}

.cyber-connection-line {
  box-shadow: 0 0 10px currentColor;
}

.services-mobile-carousel {
  display: block;
}

@media (min-width: 769px) {
  .services-mobile-carousel {
    display: none;
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
