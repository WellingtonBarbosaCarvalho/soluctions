/**
 * TEAM SECTION INTERACTIONS - Animações e interações da nova seção de equipe
 * Design original com avatars e matrix de habilidades
 */

class TeamSectionInteractions {
  constructor() {
    this.teamCards = document.querySelectorAll(".cyber-team-card-compact");
    this.matrixNodes = document.querySelectorAll(".cyber-matrix-node");
    this.avatars = document.querySelectorAll(
      ".cyber-avatar-placeholder, .cyber-avatar-mini"
    );

    this.init();
  }

  init() {
    this.setupCardInteractions();
    this.setupMatrixInteractions();
    this.setupAvatarAnimations();
    this.setupScrollAnimations();
  }

  /**
   * Configurar interações dos cards da equipe
   */
  setupCardInteractions() {
    this.teamCards.forEach((card, index) => {
      // Hover effect com delay baseado no índice
      card.addEventListener("mouseenter", () => {
        this.animateCardHover(card, true);

        // Highlight de skills relacionadas
        const skills = card.querySelectorAll(".cyber-skill-badge");
        skills.forEach((skill, skillIndex) => {
          setTimeout(() => {
            skill.style.transform = "scale(1.1)";
            skill.style.boxShadow = "0 0 15px rgba(0, 243, 255, 0.5)";
          }, skillIndex * 100);
        });
      });

      card.addEventListener("mouseleave", () => {
        this.animateCardHover(card, false);

        // Reset skills
        const skills = card.querySelectorAll(".cyber-skill-badge");
        skills.forEach((skill) => {
          skill.style.transform = "";
          skill.style.boxShadow = "";
        });
      });

      // Click para expandir informações
      card.addEventListener("click", () => {
        this.toggleCardExpansion(card);
      });
    });
  }

  /**
   * Animar hover dos cards
   */
  animateCardHover(card, isHover) {
    const avatar = card.querySelector(".cyber-avatar-mini");
    const roleIndicator = card.querySelector(".cyber-role-indicator");
    const stats = card.querySelectorAll(".cyber-stat-number");

    if (isHover) {
      // Animar avatar
      if (avatar) {
        avatar.style.transform = "scale(1.1) rotate(5deg)";
        avatar.style.boxShadow = "0 0 25px rgba(0, 243, 255, 0.8)";
      }

      // Animar indicador de role
      if (roleIndicator) {
        roleIndicator.style.transform = "scale(1.3)";
        roleIndicator.style.boxShadow = "0 0 15px currentColor";
      }

      // Contar números das estatísticas
      stats.forEach((stat) => {
        this.animateCounter(stat);
      });
    } else {
      // Reset animations
      if (avatar) {
        avatar.style.transform = "";
        avatar.style.boxShadow = "";
      }
      if (roleIndicator) {
        roleIndicator.style.transform = "";
        roleIndicator.style.boxShadow = "";
      }
    }
  }

  /**
   * Animar contador de estatísticas
   */
  animateCounter(element) {
    const targetText = element.textContent;
    const targetNumber = parseInt(targetText.replace(/\D/g, ""));
    const suffix = targetText.replace(/\d/g, "");

    if (isNaN(targetNumber)) return;

    let current = 0;
    const increment = targetNumber / 30; // 30 frames
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 50);
  }

  /**
   * Configurar interações da matrix de habilidades
   */
  setupMatrixInteractions() {
    this.matrixNodes.forEach((node, index) => {
      node.addEventListener("mouseenter", () => {
        this.highlightMatrixNode(node, index);
      });

      node.addEventListener("mouseleave", () => {
        this.resetMatrixNode(node);
      });

      node.addEventListener("click", () => {
        this.showSkillDetails(node);
      });
    });

    // Animar conexões da matrix
    this.animateMatrixConnections();
  }

  /**
   * Destacar nó da matrix
   */
  highlightMatrixNode(node, index) {
    const core = node.querySelector(".cyber-node-core");
    const label = node.querySelector(".cyber-node-label");

    // Cores baseadas no tipo de skill
    const colors = [
      "#00f3ff", // Frontend - Blue
      "#bc13fe", // Backend - Purple
      "#ff2a6d", // AI/ML - Pink
      "#00ff88", // Marketing - Green
      "#f7df1e", // CRM - Yellow
      "#ff6b35", // Analytics - Orange
    ];

    const color = colors[index % colors.length];

    core.style.borderColor = color;
    core.style.boxShadow = `0 0 30px ${color}`;
    core.style.transform = "scale(1.2)";

    if (label) {
      label.style.color = color;
      label.style.fontWeight = "600";
    }

    // Conectar com outros nós (efeito visual)
    this.createConnectionEffect(node, color);
  }

  /**
   * Reset do nó da matrix
   */
  resetMatrixNode(node) {
    const core = node.querySelector(".cyber-node-core");
    const label = node.querySelector(".cyber-node-label");

    core.style.borderColor = "";
    core.style.boxShadow = "";
    core.style.transform = "";

    if (label) {
      label.style.color = "";
      label.style.fontWeight = "";
    }

    // Remover efeitos de conexão
    this.removeConnectionEffects();
  }

  /**
   * Criar efeito de conexão entre nós
   */
  createConnectionEffect(activeNode, color) {
    const matrix = document.querySelector(".cyber-team-matrix");
    if (!matrix) return;

    // Remover conexões existentes
    this.removeConnectionEffects();

    // Criar linhas de conexão
    this.matrixNodes.forEach((node) => {
      if (node !== activeNode) {
        const line = this.createConnectionLine(activeNode, node, color);
        matrix.appendChild(line);
      }
    });
  }

  /**
   * Criar linha de conexão entre dois nós
   */
  createConnectionLine(node1, node2, color) {
    const line = document.createElement("div");
    line.className = "cyber-connection-line";

    const rect1 = node1.getBoundingClientRect();
    const rect2 = node2.getBoundingClientRect();
    const matrixRect = document
      .querySelector(".cyber-team-matrix")
      .getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - matrixRect.left;
    const y1 = rect1.top + rect1.height / 2 - matrixRect.top;
    const x2 = rect2.left + rect2.width / 2 - matrixRect.left;
    const y2 = rect2.top + rect2.height / 2 - matrixRect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    line.style.cssText = `
      position: absolute;
      width: ${length}px;
      height: 2px;
      background: linear-gradient(90deg, ${color}80, transparent);
      left: ${x1}px;
      top: ${y1}px;
      transform-origin: 0 50%;
      transform: rotate(${angle}deg);
      opacity: 0;
      animation: fadeInLine 0.5s ease forwards;
      pointer-events: none;
      z-index: 1;
    `;

    return line;
  }

  /**
   * Remover efeitos de conexão
   */
  removeConnectionEffects() {
    const lines = document.querySelectorAll(".cyber-connection-line");
    lines.forEach((line) => line.remove());
  }

  /**
   * Configurar animações dos avatars
   */
  setupAvatarAnimations() {
    this.avatars.forEach((avatar) => {
      // Animação de respiração
      const glow = avatar.querySelector(".cyber-avatar-glow");
      if (glow) {
        this.addBreathingAnimation(glow);
      }

      // Efeito parallax sutil no mouse
      avatar.addEventListener("mousemove", (e) => {
        this.addParallaxEffect(avatar, e);
      });

      avatar.addEventListener("mouseleave", () => {
        avatar.style.transform = "";
      });
    });
  }

  /**
   * Adicionar animação de respiração
   */
  addBreathingAnimation(element) {
    let scale = 1;
    let direction = 1;

    const breathe = () => {
      scale += direction * 0.02;
      if (scale >= 1.1) direction = -1;
      if (scale <= 0.9) direction = 1;

      element.style.transform = `scale(${scale})`;
      requestAnimationFrame(breathe);
    };

    breathe();
  }

  /**
   * Efeito parallax sutil
   */
  addParallaxEffect(avatar, event) {
    const rect = avatar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = ((event.clientX - centerX) / rect.width) * 10;
    const deltaY = ((event.clientY - centerY) / rect.height) * 10;

    avatar.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
  }

  /**
   * Configurar animações de scroll
   */
  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateTeamSection(entry.target);
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

  /**
   * Animar entrada da seção
   */
  animateTeamSection(section) {
    // Animar cards em sequência
    this.teamCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 200);
    });

    // Animar matrix nodes
    setTimeout(() => {
      this.matrixNodes.forEach((node, index) => {
        setTimeout(() => {
          node.style.opacity = "1";
          node.style.transform = "scale(1)";
        }, index * 100);
      });
    }, 800);
  }

  /**
   * Toggle expansão do card
   */
  toggleCardExpansion(card) {
    const isExpanded = card.classList.contains("expanded");

    // Reset todos os cards
    this.teamCards.forEach((c) => c.classList.remove("expanded"));

    if (!isExpanded) {
      card.classList.add("expanded");
      this.showExpandedContent(card);
    }
  }

  /**
   * Mostrar conteúdo expandido
   */
  showExpandedContent(card) {
    // Implementar conteúdo expandido se necessário
    console.log("Card expandido:", card);
  }

  /**
   * Mostrar detalhes da skill
   */
  showSkillDetails(node) {
    const skill = node.dataset.skill;
    console.log("Skill selecionada:", skill);

    // Implementar modal ou tooltip com detalhes da skill
  }
}

// CSS para animações adicionais
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
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new TeamSectionInteractions();
});

// Inicializar também no evento pageReady para compatibilidade
document.addEventListener("pageReady", () => {
  new TeamSectionInteractions();
});

window.TeamSectionInteractions = TeamSectionInteractions;
