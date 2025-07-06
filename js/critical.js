/**
 * JavaScript CRÍTICO - Funcionalidades essenciais para first paint
 * Execução imediata e simplificada
 */

// Prevent FOUC
document.documentElement.classList.add("fouc-ready");

// Variáveis globais
let isPageLoaded = false;

/**
 * Preloader simplificado - execução garantida
 */
function initPreloader() {
  console.log("Iniciando preloader...");

  const loader = document.getElementById("preloader");
  const progressFill = document.querySelector(".loader-progress-fill");

  console.log("Loader encontrado:", loader);
  console.log("Progress encontrado:", progressFill);

  if (!loader) {
    console.warn("Preloader não encontrado!");
    return;
  }

  // Animar progresso imediatamente
  if (progressFill) {
    progressFill.style.width = "100%";
  }

  // Função para esconder o preloader
  const hidePreloader = () => {
    console.log("Escondendo preloader...");
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.3s ease";

    setTimeout(() => {
      loader.style.display = "none";
      document.body.style.overflow = "visible";
      isPageLoaded = true;
      console.log("Preloader removido!");

      // Disparar evento
      document.dispatchEvent(new CustomEvent("pageReady"));
    }, 300);
  };

  // Esconder preloader rapidamente para teste
  setTimeout(hidePreloader, 1000);
}

/**
 * Mobile menu básico
 */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".mobile-nav-overlay");
  const closeBtn = document.querySelector(".mobile-nav-close");

  if (!menuBtn) return;

  const toggleMenu = (show) => {
    if (mobileNav) {
      mobileNav.style.transform = show ? "translateX(0)" : "translateX(100%)";
    }
    if (overlay) {
      overlay.style.display = show ? "block" : "none";
    }
    document.body.style.overflow = show ? "hidden" : "visible";
  };

  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu(true);
  });

  [closeBtn, overlay].forEach((element) => {
    if (element) {
      element.addEventListener("click", () => toggleMenu(false));
    }
  });
}

/**
 * Scroll suave
 */
function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

// INICIALIZAÇÃO IMEDIATA
console.log("Script crítico carregado!");

// Executar quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Ready - iniciando...");
    initPreloader();
    initMobileMenu();
    initSmoothScroll();
  });
} else {
  console.log("DOM já pronto - iniciando imediatamente...");
  initPreloader();
  initMobileMenu();
  initSmoothScroll();
}

/**
 * Mobile menu otimizado - sem dependências
 */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".mobile-nav-overlay");
  const closeBtn = document.querySelector(".mobile-nav-close");

  if (!menuBtn) return;

  const toggleMenu = (show) => {
    if (mobileNav) {
      mobileNav.style.transform = show ? "translateX(0)" : "translateX(100%)";
    }
    if (overlay) {
      overlay.style.display = show ? "block" : "none";
    }
    document.body.style.overflow = show ? "hidden" : "visible";
  };

  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu(true);
  });

  [closeBtn, overlay].forEach((element) => {
    if (element) {
      element.addEventListener("click", () => toggleMenu(false));
    }
  });

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });
}

/**
 * Scroll suave para anchors - implementação nativa otimizada
 */
function initSmoothScroll() {
  // Usar CSS scroll-behavior quando possível
  if ("scrollBehavior" in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = "smooth";
    return;
  }

  // Fallback para browsers antigos
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

/**
 * Lazy loading nativo para imagens críticas
 */
function initLazyLoading() {
  // Verificar suporte nativo
  if ("loading" in HTMLImageElement.prototype) {
    return; // Usar atributo loading="lazy" nativo
  }

  // Fallback para browsers sem suporte
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback sem IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

/**
 * Performance optimizations essenciais
 */
function initPerformanceOptimizations() {
  // Prefetch de recursos importantes quando idle
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      // Prefetch de imagens críticas
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

  // Otimizar scroll events
  let scrollTimeout;
  const optimizedScrollHandler = () => {
    if (scrollTimeout) return;

    scrollTimeout = requestAnimationFrame(() => {
      // Scroll indicator
      const scrolled = window.pageYOffset;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrolled / maxScroll) * 100;

      const indicator = document.querySelector(".scroll-indicator");
      if (indicator) {
        indicator.style.width = `${scrollPercent}%`;
      }

      scrollTimeout = null;
    });
  };

  window.addEventListener("scroll", optimizedScrollHandler, { passive: true });
}

/**
 * Carregamento dinâmico de conteúdo não crítico
 */
function loadNonCriticalContent() {
  // Carregar apenas quando a página estiver pronta
  document.addEventListener("pageReady", () => {
    requestIdleCallback(() => {
      // Aqui carregaremos o resto do conteúdo
      loadDynamicSections();
    });
  });
}

/**
 * Carregar seções dinâmicas
 */
function loadDynamicSections() {
  const dynamicContent = document.getElementById("dynamic-content");
  if (!dynamicContent) return;

  // Template do conteúdo principal (será implementado)
  const mainContent = `
    <!-- O resto das seções será carregado aqui -->
    <div id="services-section"></div>
    <div id="cases-section"></div>
    <div id="contact-section"></div>
  `;

  dynamicContent.innerHTML = mainContent;
}

/**
 * Inicialização principal - execução imediata
 */
(function init() {
  // Funcionalidades críticas executam imediatamente
  initPreloader();
  initMobileMenu();
  initSmoothScroll();
  initLazyLoading();
  initPerformanceOptimizations();

  // Conteúdo não crítico carrega depois
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNonCriticalContent);
  } else {
    loadNonCriticalContent();
  }
})();

/**
 * Web Vitals tracking (opcional)
 */
function trackWebVitals() {
  if ("PerformanceObserver" in window) {
    // FCP tracking
    const fcpObserver = new PerformanceObserver((list) => {
      const fcpEntry = list
        .getEntries()
        .find((entry) => entry.name === "first-contentful-paint");
      if (fcpEntry) {
        console.log("FCP:", fcpEntry.startTime.toFixed(2), "ms");
      }
    });
    fcpObserver.observe({ entryTypes: ["paint"] });

    // LCP tracking
    const lcpObserver = new PerformanceObserver((list) => {
      const lcpEntry = list.getEntries()[list.getEntries().length - 1];
      console.log("LCP:", lcpEntry.startTime.toFixed(2), "ms");
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  }
}

/**
 * Garantir inicialização do AOS quando disponível
 */
function ensureAOSInit() {
  // Verificar se AOS está disponível
  if (typeof AOS !== "undefined") {
    console.log("Inicializando AOS...");
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  } else {
    // Retry após um pequeno delay se AOS não estiver carregado ainda
    setTimeout(ensureAOSInit, 100);
  }
}

// Ativar tracking em desenvolvimento
if (window.location.hostname === "localhost") {
  trackWebVitals();
}

// Tentar inicializar AOS quando disponível
document.addEventListener("DOMContentLoaded", ensureAOSInit);
window.addEventListener("load", ensureAOSInit);
