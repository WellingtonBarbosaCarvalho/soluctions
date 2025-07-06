/**
 * Sistema avançado de lazy loading para imagens
 * Suporte a WebP, AVIF e fallbacks
 */

class OptimizedImageLoader {
  constructor() {
    this.supportsWebP = null;
    this.supportsAVIF = null;
    this.imageQueue = [];
    this.isLoading = false;

    this.init();
  }

  /**
   * Inicializar o sistema
   */
  async init() {
    await this.detectFormatSupport();
    this.setupIntersectionObserver();
    this.processExistingImages();
  }

  /**
   * Detectar suporte a formatos modernos
   */
  async detectFormatSupport() {
    // Detectar WebP
    this.supportsWebP = await this.canUseWebP();

    // Detectar AVIF
    this.supportsAVIF = await this.canUseAVIF();

    console.log(
      "Format Support - WebP:",
      this.supportsWebP,
      "AVIF:",
      this.supportsAVIF
    );
  }

  /**
   * Verificar suporte WebP
   */
  canUseWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }

  /**
   * Verificar suporte AVIF
   */
  canUseAVIF() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    });
  }

  /**
   * Configurar Intersection Observer
   */
  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) {
      // Fallback para browsers antigos
      this.loadAllImages();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );
  }

  /**
   * Processar imagens existentes no DOM
   */
  processExistingImages() {
    const images = document.querySelectorAll("img[data-src], img[data-srcset]");
    images.forEach((img) => {
      if (this.observer) {
        this.observer.observe(img);
      } else {
        this.loadImage(img);
      }
    });
  }

  /**
   * Carregar imagem otimizada
   */
  async loadImage(img) {
    const originalSrc = img.dataset.src || img.src;
    const optimizedSrc = this.getOptimizedSrc(originalSrc);

    // Aplicar blur-up effect
    if (img.dataset.placeholder) {
      img.src = img.dataset.placeholder;
      img.style.filter = "blur(5px)";
      img.style.transition = "filter 0.3s ease";
    }

    try {
      await this.preloadImage(optimizedSrc);

      // Remover blur e aplicar imagem final
      img.src = optimizedSrc;
      img.style.filter = "none";

      // Remover atributos de lazy loading
      img.removeAttribute("data-src");
      img.removeAttribute("data-placeholder");

      // Adicionar classe de carregada
      img.classList.add("loaded");
    } catch (error) {
      console.warn(
        "Failed to load optimized image, falling back to original:",
        error
      );
      img.src = originalSrc;
    }
  }

  /**
   * Obter URL otimizada baseada no suporte do browser
   */
  getOptimizedSrc(originalSrc) {
    // Se for uma imagem externa, retornar como está
    if (
      originalSrc.startsWith("http") &&
      !originalSrc.includes("pixabay") &&
      !originalSrc.includes("unsplash")
    ) {
      return originalSrc;
    }

    // Para imagens que podemos otimizar
    const baseName = originalSrc.split(".").slice(0, -1).join(".");

    if (this.supportsAVIF) {
      return `${baseName}.avif`;
    } else if (this.supportsWebP) {
      return `${baseName}.webp`;
    }

    return originalSrc;
  }

  /**
   * Precarregar imagem
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Fallback para carregar todas as imagens
   */
  loadAllImages() {
    const images = document.querySelectorAll("img[data-src]");
    images.forEach((img) => this.loadImage(img));
  }

  /**
   * Adicionar nova imagem ao sistema
   */
  addImage(img) {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      this.loadImage(img);
    }
  }
}

/**
 * Utility para gerar placeholders base64 blur
 */
class PlaceholderGenerator {
  static generateBlurDataURL(width, height, color = "#1a1a2e") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL("image/jpeg", 0.1);
  }

  static async generateFromImage(imgSrc, targetWidth = 20, targetHeight = 20) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL("image/jpeg", 0.1));
      };

      img.onerror = () => {
        resolve(this.generateBlurDataURL(targetWidth, targetHeight));
      };

      img.src = imgSrc;
    });
  }
}

/**
 * Inicializar sistema quando DOM estiver pronto
 */
document.addEventListener("DOMContentLoaded", () => {
  window.optimizedImageLoader = new OptimizedImageLoader();
});

// Exportar para uso global
window.OptimizedImageLoader = OptimizedImageLoader;
window.PlaceholderGenerator = PlaceholderGenerator;
