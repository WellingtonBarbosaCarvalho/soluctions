/**
 * Soluctions S.A - Cyberpunk Modern Landing Page
 * JavaScript Principal com suporte aos recursos avançados
 */

document.addEventListener("DOMContentLoaded", () => {
  // Aplicar classe para evitar FOUC (Flash of Unstyl      // Alternar estado atual
  if (isOpen) {
    console.log("FAQ: Fechando pergunta");
    question.classList.remove("active");
    answer.style.maxHeight = null;
    console.log("FAQ: Max-height definido como null");
  } else {
    console.log("FAQ: Abrindo pergunta");
    question.classList.add("active");
    answer.style.maxHeight = answer.scrollHeight + "px";
    console.log("FAQ: Altura definida para:", answer.scrollHeight + "px");
    console.log(
      "FAQ: Max-height atual do elemento:",
      window.getComputedStyle(answer).maxHeight
    );

    // Forçar um refresh do estilo
    setTimeout(() => {
      console.log(
        "FAQ: Max-height após timeout:",
        window.getComputedStyle(answer).maxHeight
      );
    }, 100);
  }
  document.body.classList.add("fouc-ready");

  // Iniciar preloader
  initPreloader();

  // Configurar observador para animações
  initScrollObserver();

  // Iniciar interações UI
  initUIInteractions();

  // Iniciar efeitos visuais
  initVisualEffects();

  // Iniciar contadores
  initCounters();

  // Configurar chatbot
  initChatbot();

  // Inicializar AOS (Animate on Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
  }
});

/**
 * Inicializa o preloader animado
 */
function initPreloader() {
  const loader = document.querySelector(".loader");
  const loaderFill = document.querySelector(".loader-progress-fill");

  if (!loader || !loaderFill) return;

  // Animar preenchimento do loader
  setTimeout(() => {
    loaderFill.style.width = "60%";
  }, 100);

  setTimeout(() => {
    loaderFill.style.width = "100%";
  }, 1000);

  // Ocultar loader após carregamento
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");

      // Inicializar partículas apenas após o loader ser ocultado
      initParticles();
    }, 1500);
  });
}

/**
 * Observador para animações de scroll
 */
function initScrollObserver() {
  // Observer para animações reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          // Ativar TODOS os contadores dentro do elemento visível
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

  // Observar todos os elementos com classe 'reveal' e os containers de métrica
  document
    .querySelectorAll(".reveal, .cyber-metric-card")
    .forEach((element) => {
      revealObserver.observe(element);
    });

  // Atualizar indicador de scroll
  window.addEventListener("scroll", updateScrollIndicator);
}

/**
 * Atualiza o indicador de scroll
 */
function updateScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (!scrollIndicator) return;

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollIndicator.style.transform = `scaleX(${scrollPercentage / 100})`;

  // Atualizar header ao rolar
  const header = document.querySelector("header");
  if (header) {
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
}

/**
 * Inicializa as interações da UI
 */
function initUIInteractions() {
  // Menu mobile
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavClose = document.querySelector(".mobile-nav-close");

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.add("active");
      mobileNav.style.transform = "translateX(0)";
      document.body.style.overflow = "hidden";
      if (mobileNavOverlay) mobileNavOverlay.classList.add("active");
    });
  }

  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener("click", closeMenu);
  }

  if (mobileNavOverlay && mobileNav) {
    mobileNavOverlay.addEventListener("click", closeMenu);
  }

  function closeMenu() {
    mobileNav.classList.remove("active");
    mobileNav.style.transform = "translateX(100%)";
    document.body.style.overflow = "";
    if (mobileNavOverlay) mobileNavOverlay.classList.remove("active");
  }

  // Links de navegação
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    // Adicionar evento de clique para rolagem suave
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      // Fechar menu mobile se estiver aberto
      if (mobileNav && mobileNav.classList.contains("active")) {
        closeMenu();
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Atualizar URL sem rolar
        history.pushState(null, null, targetId);
      }
    });
  });

  // Inicializar FAQs
  const faqQuestions = document.querySelectorAll(".cyber-faq-question");
  console.log("FAQ: Encontrados", faqQuestions.length, "elementos FAQ");

  faqQuestions.forEach((question, index) => {
    console.log("FAQ: Configurando evento para pergunta", index + 1);

    question.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("FAQ: Clique detectado na pergunta", index + 1);

      const answer = question.nextElementSibling;
      const isOpen = question.classList.contains("active");

      console.log("FAQ: Resposta encontrada:", !!answer);
      console.log("FAQ: Estado atual (aberto):", isOpen);

      // Fechar todas as outras perguntas
      faqQuestions.forEach((q) => {
        if (q !== question) {
          q.classList.remove("active");
          q.nextElementSibling.style.maxHeight = null;
        }
      });

      // Alternar estado atual
      if (isOpen) {
        console.log("FAQ: Fechando pergunta");
        question.classList.remove("active");
        answer.style.maxHeight = null;
      } else {
        console.log("FAQ: Abrindo pergunta");
        question.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        console.log("FAQ: Altura definida para:", answer.scrollHeight + "px");
      }
    });
  });

  // Destacar link de navegação ativo
  updateActiveNavLink();
  window.addEventListener("scroll", updateActiveNavLink);
}

/**
 * Atualiza o link de navegação ativo com base na posição de rolagem
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY;
    const headerHeight = document.querySelector("header").offsetHeight;

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

/**
 * Inicializa efeitos visuais
 */
function initVisualEffects() {
  // Cursor personalizado
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");

  if (cursor && cursorDot && window.innerWidth > 768) {
    document.addEventListener("mousemove", (e) => {
      // Animação suave com GSAP se disponível
      if (typeof gsap !== "undefined") {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
        });

        gsap.to(cursorDot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
        });
      } else {
        // Fallback se GSAP não estiver disponível
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    });

    // Adicionar interações com elementos interativos
    const interactiveElements = document.querySelectorAll(
      "a, button, input, select, textarea, .cursor-pointer"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
        cursorDot.classList.add("active");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
        cursorDot.classList.remove("active");
      });
    });
  } else {
    // Em dispositivos móveis ou se não houver o cursor customizado, ocultá-lo
    if (cursor) cursor.style.display = "none";
    if (cursorDot) cursorDot.style.display = "none";
  }
}

/**
 * Inicializa animações de contador
 * @param {HTMLElement} counter - Elemento contador
 */
function animateCounter(counter) {
  const target = parseInt(counter.getAttribute("data-target"));
  if (isNaN(target)) return; // Evita erros se o data-target não for um número

  // Ajuste a duração da animação com base no valor alvo
  const duration = target > 100 ? 2000 : 1500;
  const frameDuration = 1000 / 60; // 60fps
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
      counter.textContent = target; // Garantir que o alvo seja atingido
    }
  };

  animate();
}

document.addEventListener("DOMContentLoaded", () => {
  // Aplicar classe para evitar FOUC (Flash of Unstyled Content)
  document.body.classList.add("fouc-ready");

  // Iniciar preloader
  initPreloader();

  // Configurar observador para animações
  initScrollObserver();

  // Iniciar interações UI
  initUIInteractions();

  // Iniciar efeitos visuais
  initVisualEffects();

  // Iniciar contadores imediatamente se estiverem visíveis
  initCounters();

  // Configurar chatbot
  initChatbot();

  // Verificar contadores novamente quando o scroll ocorrer
  window.addEventListener("scroll", debounce(initCounters, 100));

  // Inicializar AOS (Animate on Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
  }
});

// 5. Adicione uma função de debounce para evitar chamadas excessivas durante o scroll
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Inicializa todos os contadores
 */
function initCounters() {
  // Inicializar contadores visíveis na tela
  const counters = document.querySelectorAll(".counter:not(.counted)");

  counters.forEach((counter) => {
    if (isElementInViewport(counter)) {
      animateCounter(counter);
      counter.classList.add("counted");
    }
  });
}

/**
 * Verifica se um elemento está visível na viewport
 * @param {HTMLElement} el - Elemento a verificar
 * @returns {boolean} - true se visível
 */
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

/**
 * Inicializa o sistema de partículas
 */
function initParticles() {
  if (
    typeof particlesJS !== "undefined" &&
    document.getElementById("particles-js")
  ) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#00f3ff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#00f3ff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }
}

/**
 * Inicializa chatbot melhorado com animações e UX aprimorada
 */
function initChatbot() {
  // Elementos do chatbot
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

  chatbotClose.addEventListener("click", () => {
    chatbotBox.classList.add("hidden");
    chatbotBox.classList.remove("active");
    chatbotButton.classList.remove("hidden");
  });

  chatbotMinimize.addEventListener("click", () => {
    chatbotBox.classList.add("hidden");
    chatbotBox.classList.remove("active");
    chatbotButton.classList.remove("hidden");
  });

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

  chatbotSend.addEventListener("click", sendMessage);

  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Processar resposta do chatbot (simulada)
  function processResponse(message) {
    const lowerMessage = message.toLowerCase();
    let response;

    // Respostas simuladas baseadas em palavras-chave
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

    // Converter quebras de linha em HTML
    message = message.replace(/\n/g, "<br>");

    messageElement.innerHTML = message;
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }

  // Adicionar mensagem do bot com botão de WhatsApp
  function addBotMessageWithWhatsapp(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message", "bot");

    // Converter quebras de linha em HTML
    message = message.replace(/\n/g, "<br>");

    // Adicionar conteúdo HTML da mensagem
    messageElement.innerHTML = message;

    // Adicionar botão WhatsApp
    const whatsappButton = document.createElement("a");
    whatsappButton.classList.add("whatsapp-button");
    whatsappButton.href = "https://wa.me/5511912345678"; // Número fictício
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
