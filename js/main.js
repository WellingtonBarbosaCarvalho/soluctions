/**
 * ========================================
 * SOLUCTIONS CYBERPUNK EXPERIENCE SYSTEM
 * ========================================
 * Sistema de experiência futurística completo
 * Arquitetura orientada a objetos otimizada
 */

class CyberpunkExperienceSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.energyField = null;
    this.audioContext = null;
    this.isInitialized = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentStage = 'button';
    
    // Estados do sistema
    this.states = {
      button: { active: true },
      form: { active: false },
      success: { active: false }
    };
    
    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    
    await this.initAudioSystem();
    this.initCanvas();
    this.initParticleSystem();
    this.initEnergyField();
    this.initMatrixBackground();
    this.initSuperSaiyanButton();
    this.initQuantumForm();
    this.initEventListeners();
    
    this.isInitialized = true;
    this.startRenderLoop();
  }

  // ========================================
  // SISTEMA DE ÁUDIO SINTÉTICO
  // ========================================
  async initAudioSystem() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio context not supported');
    }
  }

  playTone(frequency, duration = 0.1, type = 'sine') {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playSuccessSequence() {
    if (!this.audioContext) return;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'square'), i * 200);
    });
  }

  playHoverSound() {
    this.playTone(800, 0.05, 'triangle');
  }

  playClickSound() {
    this.playTone(1200, 0.1, 'sawtooth');
  }
  // ========================================
  // SISTEMA DE PARTÍCULAS DINÂMICO
  // ========================================
  initCanvas() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'particles-canvas';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '1';
      
      const container = document.querySelector('.cyber-card-content');
      if (container) container.appendChild(this.canvas);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  initParticleSystem() {
    this.particles = [];
    
    // Criar 50 partículas
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas?.width || 400),
        y: Math.random() * (this.canvas?.height || 300),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: this.getRandomColor(),
        life: Math.random() * 100
      });
    }
  }

  getRandomColor() {
    const colors = ['#00f3ff', '#bc13fe', '#ff2a6d', '#00ff88'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateParticles() {
    if (!this.canvas || !this.ctx) return;
    
    this.particles.forEach(particle => {
      // Movimento
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Interação com cursor
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += dx * force * 0.01;
        particle.vy += dy * force * 0.01;
      }
      
      // Bordas
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Manter dentro dos limites
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Ciclo de vida
      particle.life += 1;
      if (particle.life > 200) {
        particle.life = 0;
        particle.color = this.getRandomColor();
      }
    });
  }

  renderParticles() {
    if (!this.ctx || !this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Desenhar conexões
    this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    
    // Desenhar partículas
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = particle.color;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }
  // ========================================
  // CAMPO DE ENERGIA QUE SEGUE O CURSOR
  // ========================================
  initEnergyField() {
    this.energyField = {
      x: 0,
      y: 0,
      intensity: 0,
      ripples: []
    };
  }

  updateEnergyField() {
    if (!this.energyField) return;
    
    // Suavizar movimento
    this.energyField.x += (this.mouseX - this.energyField.x) * 0.1;
    this.energyField.y += (this.mouseY - this.energyField.y) * 0.1;
    
    // Atualizar ripples
    this.energyField.ripples = this.energyField.ripples.filter(ripple => {
      ripple.radius += 2;
      ripple.opacity -= 0.02;
      return ripple.opacity > 0;
    });
  }

  renderEnergyField() {
    if (!this.ctx || !this.energyField) return;
    
    // Campo de energia principal
    const gradient = this.ctx.createRadialGradient(
      this.energyField.x, this.energyField.y, 0,
      this.energyField.x, this.energyField.y, 50
    );
    gradient.addColorStop(0, 'rgba(0, 243, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
    
    this.ctx.save();
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.energyField.x, this.energyField.y, 50, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // Ripples
    this.energyField.ripples.forEach(ripple => {
      this.ctx.save();
      this.ctx.globalAlpha = ripple.opacity;
      this.ctx.strokeStyle = '#00f3ff';
      this.ctx.lineWidth = 2;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#00f3ff';
      
      this.ctx.beginPath();
      this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      this.ctx.restore();
    });
  }

  addEnergyRipple(x, y) {
    if (!this.energyField) return;
    
    this.energyField.ripples.push({
      x: x,
      y: y,
      radius: 0,
      opacity: 1
    });
  }

  // ========================================
  // MATRIX BACKGROUND COM LINHAS CYBER
  // ========================================
  initMatrixBackground() {
    this.matrixLines = [];
    
    // Criar linhas matrix
    for (let i = 0; i < 20; i++) {
      this.matrixLines.push({
        x: Math.random() * (this.canvas?.width || 400),
        y: Math.random() * (this.canvas?.height || 300),
        length: Math.random() * 100 + 50,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  updateMatrixLines() {
    this.matrixLines.forEach(line => {
      line.x += Math.cos(line.angle) * line.speed;
      line.y += Math.sin(line.angle) * line.speed;
      
      // Wraparound
      if (line.x < 0) line.x = this.canvas?.width || 400;
      if (line.x > (this.canvas?.width || 400)) line.x = 0;
      if (line.y < 0) line.y = this.canvas?.height || 300;
      if (line.y > (this.canvas?.height || 300)) line.y = 0;
    });
  }

  renderMatrixLines() {
    if (!this.ctx) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 5;
    this.ctx.shadowColor = '#00f3ff';
    
    this.matrixLines.forEach(line => {
      this.ctx.save();
      this.ctx.globalAlpha = line.opacity;
      
      this.ctx.beginPath();
      this.ctx.moveTo(line.x, line.y);
      this.ctx.lineTo(
        line.x + Math.cos(line.angle) * line.length,
        line.y + Math.sin(line.angle) * line.length
      );
      this.ctx.stroke();
      
      this.ctx.restore();
    });
    
    this.ctx.restore();
  }

  // ========================================
  // BOTÃO SUPER SAIYAN COM EFEITOS
  // ========================================
  initSuperSaiyanButton() {
    const button = document.getElementById('cyber-btn');
    if (!button) return;
    
    this.superSaiyanButton = {
      element: button,
      energyCore: button.querySelector('.energy-core'),
      lightningBolts: button.querySelectorAll('.lightning-bolt'),
      plasmaRings: button.querySelectorAll('.plasma-ring'),
      quantumParticles: button.querySelectorAll('.quantum-particles .particle'),
      textLayers: button.querySelectorAll('.btn-text span'),
      isCharging: false,
      morphState: 0 // 0 = normal, 1 = neon bright, 2 = black with glow
    };
    
    this.initButtonAnimations();
    this.initButtonEvents();
  }

  initButtonAnimations() {
    if (!this.superSaiyanButton) return;
    
    // Gradiente cônico rotativo no núcleo
    this.animateEnergyCore();
    
    // Relâmpagos em sequência
    this.animateLightningSequence();
    
    // Anéis de plasma expandindo
    this.animatePlasmaRings();
    
    // Partículas quânticas dançando
    this.animateQuantumParticles();
    
    // Morphing total
    this.startMorphingCycle();
  }

  animateEnergyCore() {
    const { energyCore } = this.superSaiyanButton;
    if (!energyCore) return;
    
    let rotation = 0;
    const animate = () => {
      rotation += 2;
      energyCore.style.background = `conic-gradient(from ${rotation}deg, #00f3ff, #bc13fe, #ff2a6d, #00ff88, #00f3ff)`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  animateLightningSequence() {
    const { lightningBolts } = this.superSaiyanButton;
    if (!lightningBolts.length) return;
    
    const sequence = () => {
      lightningBolts.forEach((bolt, index) => {
        setTimeout(() => {
          bolt.style.opacity = '1';
          bolt.style.filter = 'drop-shadow(0 0 10px #00f3ff)';
          
          setTimeout(() => {
            bolt.style.opacity = '0.3';
            bolt.style.filter = 'none';
          }, 150);
        }, index * 100);
      });
    };
    
    setInterval(sequence, 2000);
  }

  animatePlasmaRings() {
    const { plasmaRings } = this.superSaiyanButton;
    if (!plasmaRings.length) return;
    
    plasmaRings.forEach((ring, index) => {
      const animate = () => {
        ring.style.transform = `scale(${1 + Math.sin(Date.now() * 0.005 + index) * 0.2})`;
        ring.style.opacity = `${0.3 + Math.sin(Date.now() * 0.003 + index) * 0.2}`;
        requestAnimationFrame(animate);
      };
      animate();
    });
  }

  animateQuantumParticles() {
    const { quantumParticles } = this.superSaiyanButton;
    if (!quantumParticles.length) return;
    
    quantumParticles.forEach((particle, index) => {
      const animate = () => {
        const time = Date.now() * 0.001 + index;
        const x = Math.sin(time) * 20;
        const y = Math.cos(time * 1.5) * 15;
        
        particle.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.sin(time * 2) * 0.3})`;
        particle.style.opacity = `${0.5 + Math.sin(time * 3) * 0.3}`;
        
        requestAnimationFrame(animate);
      };
      animate();
    });
  }

  startMorphingCycle() {
    const { element, textLayers } = this.superSaiyanButton;
    if (!element) return;
    
    const morphStates = [
      {
        background: 'linear-gradient(45deg, #000011, #000033)',
        color: '#00f3ff',
        shadow: '0 0 30px #00f3ff, inset 0 0 30px rgba(0, 243, 255, 0.1)'
      },
      {
        background: 'linear-gradient(45deg, #00f3ff, #bc13fe)',
        color: '#000',
        shadow: '0 0 50px #00f3ff, 0 0 100px #bc13fe'
      },
      {
        background: '#000',
        color: '#fff',
        shadow: '0 0 40px #fff, inset 0 0 20px rgba(255, 255, 255, 0.1)'
      }
    ];
    
    setInterval(() => {
      this.superSaiyanButton.morphState = (this.superSaiyanButton.morphState + 1) % morphStates.length;
      const state = morphStates[this.superSaiyanButton.morphState];
      
      element.style.background = state.background;
      element.style.boxShadow = state.shadow;
      
      textLayers.forEach(layer => {
        layer.style.color = state.color;
        layer.style.textShadow = `0 0 10px ${state.color}`;
      });
      
      this.playHoverSound();
    }, 3000);
  }

  initButtonEvents() {
    const { element } = this.superSaiyanButton;
    if (!element) return;
    
    element.addEventListener('mouseenter', () => {
      this.onButtonHover();
    });
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      this.onButtonClick();
    });
  }

  onButtonHover() {
    const { element, plasmaRings } = this.superSaiyanButton;
    
    // Intensificar efeitos
    element.style.transform = 'scale(1.05)';
    
    plasmaRings.forEach(ring => {
      ring.style.animationDuration = '0.5s';
    });
    
    this.playHoverSound();
    
    // Adicionar ripple de energia
    const rect = element.getBoundingClientRect();
    this.addEnergyRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  onButtonClick() {
    this.playClickSound();
    this.startCinematicTransition();
  }

  // ========================================
  // TRANSIÇÕES CINEMATOGRÁFICAS 3D
  // ========================================
  startCinematicTransition() {
    const buttonStage = document.getElementById('button-stage');
    const formStage = document.getElementById('form-stage');
    
    if (!buttonStage || !formStage) return;
    
    // Fase 1: Botão sai com rotação 3D dramática
    this.animateButtonExit(buttonStage).then(() => {
      // Fase 2: Portal dimensional surge
      this.animatePortalEntrance(formStage).then(() => {
        // Fase 3: Campos aparecem em cascata
        this.animateFormFields();
      });
    });
  }

  animateButtonExit(buttonStage) {
    return new Promise(resolve => {
      const button = this.superSaiyanButton.element;
      
      // Animação de saída dramática
      button.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      button.style.transform = 'rotateY(90deg) rotateX(45deg) scale(0)';
      button.style.opacity = '0';
      button.style.filter = 'blur(10px)';
      
      // Efeito de explosaço de partículas
      this.createParticleExplosion();
      
      setTimeout(() => {
        buttonStage.classList.add('hidden');
        resolve();
      }, 1000);
    });
  }

  createParticleExplosion() {
    // Criar partículas de explosação
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          size: Math.random() * 5 + 2,
          opacity: 1,
          color: this.getRandomColor(),
          life: 0,
          maxLife: 60
        });
      }, i * 50);
    }
  }

  animatePortalEntrance(formStage) {
    return new Promise(resolve => {
      formStage.classList.remove('hidden');
      
      const portal = formStage.querySelector('.form-portal');
      if (portal) {
        // Efeito de portal dimensional
        portal.style.transform = 'scale(0) rotateZ(180deg)';
        portal.style.opacity = '0';
        portal.style.filter = 'blur(20px) hue-rotate(180deg)';
        
        setTimeout(() => {
          portal.style.transition = 'all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          portal.style.transform = 'scale(1) rotateZ(0deg)';
          portal.style.opacity = '1';
          portal.style.filter = 'blur(0px) hue-rotate(0deg)';
          
          resolve();
        }, 100);
      } else {
        resolve();
      }
    });
  }

  animateFormFields() {
    const fields = document.querySelectorAll('.nano-field');
    const submitButton = document.querySelector('.quantum-submit');
    
    fields.forEach((field, index) => {
      setTimeout(() => {
        field.style.transform = 'translateY(0)';
        field.style.opacity = '1';
        field.style.filter = 'blur(0)';
        
        // Efeito de data stream
        this.animateDataStream(field);
      }, index * 200);
    });
    
    // Animar botão submit por último
    setTimeout(() => {
      if (submitButton) {
        submitButton.style.transform = 'scale(1)';
        submitButton.style.opacity = '1';
        this.animateSubmitButton(submitButton);
      }
    }, fields.length * 200 + 300);
  }

  // ========================================
  // FORMULÁRIO FUTURISTA COM ANIMAÇÕES
  // ========================================
  initQuantumForm() {
    const form = document.getElementById('quantum-form');
    if (!form) return;
    
    this.setupFloatingLabels();
    this.setupGlowEffects();
    this.setupDataStreams();
    this.setupRealtimeValidation();
    this.setupQuantumSubmit();
  }

  setupFloatingLabels() {
    const inputs = document.querySelectorAll('.nano-field input');
    
    inputs.forEach(input => {
      const label = input.nextElementSibling;
      
      input.addEventListener('focus', () => {
        if (label) {
          label.style.transform = 'translateY(-25px) scale(0.8)';
          label.style.color = '#00f3ff';
        }
        
        // Ativar glow effect
        input.parentElement.classList.add('field-active');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value && label) {
          label.style.transform = 'translateY(0) scale(1)';
          label.style.color = 'rgba(255, 255, 255, 0.7)';
        }
        
        input.parentElement.classList.remove('field-active');
      });
      
      input.addEventListener('input', () => {
        this.validateFieldRealtime(input);
      });
    });
  }

  setupRealtimeValidation() {
    // Configurar validação em tempo real para todos os inputs
    const inputs = document.querySelectorAll('.nano-field input');
    
    inputs.forEach(input => {
      // Validar em tempo real enquanto digita (com debounce)
      let validationTimeout;
      
      input.addEventListener('input', () => {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          this.validateFieldRealtime(input);
        }, 300); // Debounce de 300ms
      });
      
      // Validar imediatamente ao sair do campo
      input.addEventListener('blur', () => {
        clearTimeout(validationTimeout);
        this.validateFieldRealtime(input);
      });
    });
  }

  setupGlowEffects() {
    const fieldGlows = document.querySelectorAll('.field-glow');
    
    fieldGlows.forEach(glow => {
      const input = glow.parentElement.querySelector('input');
      
      if (input) {
        input.addEventListener('focus', () => {
          glow.style.opacity = '1';
          glow.style.transform = 'scale(1.1)';
        });
        
        input.addEventListener('blur', () => {
          glow.style.opacity = '0';
          glow.style.transform = 'scale(1)';
        });
      }
    });
  }

  setupDataStreams() {
    // Configurar streams de dados visuais nos campos
    const dataStreams = document.querySelectorAll('.data-stream');
    
    dataStreams.forEach(stream => {
      const field = stream.closest('.nano-field');
      const input = field?.querySelector('input');
      
      if (input) {
        input.addEventListener('focus', () => {
          this.activateDataStream(stream);
        });
        
        input.addEventListener('blur', () => {
          this.deactivateDataStream(stream);
        });
      }
    });
  }

  activateDataStream(stream) {
    // Criar partículas de dados
    const particle = document.createElement('div');
    particle.className = 'data-particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 8px;
      background: linear-gradient(to bottom, transparent, #00f3ff, transparent);
      left: 0;
      top: 0;
      animation: dataFlow 1.5s linear infinite;
    `;
    
    stream.appendChild(particle);
    
    // Remover após animação
    setTimeout(() => {
      if (particle.parentElement) {
        particle.parentElement.removeChild(particle);
      }
    }, 1500);
  }

  deactivateDataStream(stream) {
    // Limpar partículas existentes
    const particles = stream.querySelectorAll('.data-particle');
    particles.forEach(particle => {
      if (particle.parentElement) {
        particle.parentElement.removeChild(particle);
      }
    });
  }

  animateDataStream(field) {
    const dataStream = field.querySelector('.data-stream');
    if (!dataStream) return;
    
    // Criar efeito de stream de dados
    const stream = document.createElement('div');
    stream.className = 'data-particle';
    stream.style.cssText = `
      position: absolute;
      width: 2px;
      height: 10px;
      background: linear-gradient(to bottom, transparent, #00f3ff, transparent);
      left: 0;
      top: 0;
      animation: dataFlow 2s linear infinite;
    `;
    
    dataStream.appendChild(stream);
    
    setTimeout(() => {
      if (stream.parentElement) {
        stream.parentElement.removeChild(stream);
      }
    }, 2000);
  }

  validateFieldRealtime(input) {
    const field = input.parentElement;
    const isValid = this.validateInput(input);
    
    if (isValid) {
      field.classList.add('field-valid');
      field.classList.remove('field-invalid');
      
      // Efeito visual de sucesso
      this.createValidationParticles(field, '#00ff88');
    } else if (input.value.length > 0) {
      field.classList.add('field-invalid');
      field.classList.remove('field-valid');
      
      // Efeito visual de erro
      this.createValidationParticles(field, '#ff2a6d');
    }
  }

  validateInput(input) {
    switch (input.type) {
      case 'text':
        return input.value.trim().length >= 2;
      case 'tel':
        return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(input.value);
      default:
        return input.value.trim().length > 0;
    }
  }

  createValidationParticles(field, color) {
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        top: 50%;
        right: 10px;
        animation: validationParticle 1s ease-out forwards;
        animation-delay: ${i * 100}ms;
      `;
      
      field.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentElement) {
          particle.parentElement.removeChild(particle);
        }
      }, 1000 + (i * 100));
    }
  }

  setupQuantumSubmit() {
    const submitButton = document.querySelector('.quantum-submit');
    const form = document.getElementById('quantum-form');
    
    if (!submitButton || !form) return;
    
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleQuantumSubmit();
    });
    
    this.animateSubmitButton(submitButton);
  }

  animateSubmitButton(button) {
    const energy = button.querySelector('.submit-energy');
    const sparks = button.querySelectorAll('.spark');
    
    if (energy) {
      let rotation = 0;
      const animate = () => {
        rotation += 3;
        energy.style.transform = `rotate(${rotation}deg)`;
        requestAnimationFrame(animate);
      };
      animate();
    }
    
    sparks.forEach((spark, index) => {
      const animate = () => {
        const time = Date.now() * 0.001 + index;
        const x = Math.sin(time * 2) * 15;
        const y = Math.cos(time * 3) * 10;
        
        spark.style.transform = `translate(${x}px, ${y}px)`;
        spark.style.opacity = `${0.7 + Math.sin(time * 4) * 0.3}`;
        
        requestAnimationFrame(animate);
      };
      animate();
    });
  }

  handleQuantumSubmit() {
    const inputs = document.querySelectorAll('.nano-field input');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
        input.parentElement.classList.add('field-invalid');
      }
    });
    
    if (isValid) {
      this.playSuccessSequence();
      this.showSuccessPortal();
    } else {
      this.playTone(200, 0.3, 'sawtooth'); // Som de erro
    }
  }

  showSuccessPortal() {
    const formStage = document.getElementById('form-stage');
    const successStage = document.getElementById('success-stage');
    
    if (!formStage || !successStage) return;
    
    // Transition cinematográfica para sucesso
    formStage.style.transition = 'all 1s ease-out';
    formStage.style.transform = 'scale(0.8) rotateX(90deg)';
    formStage.style.opacity = '0';
    
    setTimeout(() => {
      formStage.classList.add('hidden');
      successStage.classList.remove('hidden');
      
      // Animar portal de sucesso
      const portal = successStage.querySelector('.success-portal');
      if (portal) {
        portal.style.transform = 'scale(0) rotateZ(180deg)';
        portal.style.opacity = '0';
        
        setTimeout(() => {
          portal.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          portal.style.transform = 'scale(1) rotateZ(0deg)';
          portal.style.opacity = '1';
          
          this.animateSuccessRings();
        }, 100);
      }
    }, 1000);
  }

  animateSuccessRings() {
    const rings = document.querySelectorAll('.success-rings .ring');
    
    rings.forEach((ring, index) => {
      setTimeout(() => {
        ring.style.animation = 'successRing 2s ease-out infinite';
      }, index * 200);
    });
  }

  // ========================================
  // EVENT LISTENERS E CONTROLES PRINCIPAIS
  // ========================================
  initEventListeners() {
    // Mouse tracking para campo de energia
    document.addEventListener('mousemove', (e) => {
      const canvas = this.canvas;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    // Click tracking para ripples
    document.addEventListener('click', (e) => {
      const canvas = this.canvas;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        this.addEnergyRipple(x, y);
      }
    });
  }

  // ========================================
  // LOOP DE RENDERIZAÇÃO PRINCIPAL
  // ========================================
  startRenderLoop() {
    const render = () => {
      this.updateParticles();
      this.updateEnergyField();
      this.updateMatrixLines();
      
      this.renderMatrixLines();
      this.renderParticles();
      this.renderEnergyField();
      
      requestAnimationFrame(render);
    };
    
    render();
  }
}

// ========================================
// ESTILOS CSS ADICIONAIS NECESSÁRIOS
// ========================================
const cyberpunkStyles = `
<style>
/* Animations for Cyberpunk System */
@keyframes dataFlow {
  from {
    left: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    left: 100%;
    opacity: 0;
  }
}

@keyframes validationParticle {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-30px) scale(0);
    opacity: 0;
  }
}

@keyframes successRing {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.4;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.nano-field {
  position: relative;
  margin-bottom: 1.5rem;
  transform: translateY(50px);
  opacity: 0;
  filter: blur(10px);
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.field-active .field-glow {
  opacity: 1 !important;
  transform: scale(1.1) !important;
}

.field-valid {
  border-color: #00ff88 !important;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3) !important;
}

.field-invalid {
  border-color: #ff2a6d !important;
  box-shadow: 0 0 20px rgba(255, 42, 109, 0.3) !important;
}

.quantum-submit {
  transform: scale(0);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cyber-stage {
  perspective: 1000px;
}

.form-portal {
  transform-style: preserve-3d;
}

.success-portal {
  transform-style: preserve-3d;
}
</style>
`;

// ========================================
// INICIALIZAÇÃO DO SISTEMA
// ========================================

// Verificar se já existe uma instância
if (!window.cyberpunkSystem) {
  // Adicionar estilos CSS
  document.head.insertAdjacentHTML('beforeend', cyberpunkStyles);
  
  // Inicializar sistema quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.cyberpunkSystem = new CyberpunkExperienceSystem();
    });
  } else {
    window.cyberpunkSystem = new CyberpunkExperienceSystem();
  }
}

// ========================================
// SISTEMA LEGADO MANTIDO PARA COMPATIBILIDADE
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
// OTIMIZAÇÃO DE SERVICE CARDS - SISTEMA PERFORMÁTICO
// ========================================

class OptimizedServiceCards {
  constructor() {
    this.cards = new Map();
    this.observer = null;
    this.isInitialized = false;
    this.animationFrameId = null;
    
    // Cache de elementos DOM
    this.domCache = {
      serviceCards: null,
      cardIcons: null,
      cardLinks: null,
      cardTags: null
    };
    
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    this.cacheElements();
    this.setupIntersectionObserver();
    this.setupEventListeners();
    this.setupHoverOptimizations();
    
    this.isInitialized = true;
  }
  
  cacheElements() {
    // Cache todos os elementos uma única vez
    this.domCache.serviceCards = document.querySelectorAll('.cyber-service-card.enhanced');
    this.domCache.cardIcons = document.querySelectorAll('.cyber-service-card.enhanced .cyber-service-icon');
    this.domCache.cardLinks = document.querySelectorAll('.cyber-service-card.enhanced .cyber-service-link');
    this.domCache.cardTags = document.querySelectorAll('.cyber-service-card.enhanced .cyber-tag');
    
    // Armazenar informações dos cards
    this.domCache.serviceCards.forEach((card, index) => {
      this.cards.set(card, {
        id: index,
        isVisible: false,
        isHovered: false,
        animationsEnabled: false,
        boundingRect: null
      });
    });
  }
  
  setupIntersectionObserver() {
    // Observer otimizado para ativar animações apenas quando visível
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardData = this.cards.get(entry.target);
          if (cardData) {
            cardData.isVisible = entry.isIntersecting;
            
            if (entry.isIntersecting && !cardData.animationsEnabled) {
              this.enableCardAnimations(entry.target);
              cardData.animationsEnabled = true;
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );
    
    // Observar todos os cards
    this.domCache.serviceCards.forEach(card => {
      this.observer.observe(card);
    });
  }
  
  enableCardAnimations(card) {
    // Ativar animações apenas quando o card está visível
    const beforeElement = card.querySelector('::before');
    if (beforeElement) {
      beforeElement.style.animationPlayState = 'running';
    }
    
    // Adicionar classe para animações CSS
    card.classList.add('animations-enabled');
  }
  
  setupEventListeners() {
    // Event delegation otimizado para hovers
    const serviceSection = document.getElementById('services');
    if (!serviceSection) return;
    
    // Throttled mouse events
    let hoverTimeout = null;
    
    serviceSection.addEventListener('mouseenter', (e) => {
      const card = e.target.closest('.cyber-service-card.enhanced');
      if (!card) return;
      
      clearTimeout(hoverTimeout);
      const cardData = this.cards.get(card);
      
      if (cardData && cardData.isVisible && !cardData.isHovered) {
        cardData.isHovered = true;
        this.handleCardHover(card, true);
      }
    }, true);
    
    serviceSection.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.cyber-service-card.enhanced');
      if (!card) return;
      
      const cardData = this.cards.get(card);
      
      if (cardData && cardData.isHovered) {
        hoverTimeout = setTimeout(() => {
          cardData.isHovered = false;
          this.handleCardHover(card, false);
        }, 100); // Pequeno delay para evitar flickering
      }
    }, true);
  }
  
  handleCardHover(card, isEntering) {
    // Cancelar animação anterior se existir
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.animationFrameId = requestAnimationFrame(() => {
      if (isEntering) {
        // Ativar animação da borda apenas no hover
        const beforePseudo = getComputedStyle(card, '::before');
        card.style.setProperty('--border-animation-state', 'running');
        
        // Efeito nos ícones
        const icon = card.querySelector('.cyber-service-icon');
        if (icon) {
          icon.style.transform = 'translate3d(0, 0, 0) scale(1.1)';
        }
        
        // Efeito nas tags com delay escalonado
        const tags = card.querySelectorAll('.cyber-tag');
        tags.forEach((tag, index) => {
          setTimeout(() => {
            tag.style.transform = 'translate3d(0, -2px, 0) scale(1.05)';
          }, index * 50);
        });
        
      } else {
        // Desativar animações para economizar recursos
        card.style.setProperty('--border-animation-state', 'paused');
        
        // Reset do ícone
        const icon = card.querySelector('.cyber-service-icon');
        if (icon) {
          icon.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
        
        // Reset das tags
        const tags = card.querySelectorAll('.cyber-tag');
        tags.forEach(tag => {
          tag.style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
      }
    });
  }
  
  setupHoverOptimizations() {
    // CSS custom properties para controle de animações
    const style = document.createElement('style');
    style.textContent = `
      .cyber-service-card.enhanced {
        --border-animation-state: paused;
      }
      
      .cyber-service-card.enhanced::before {
        animation-play-state: var(--border-animation-state, paused);
      }
      
      .cyber-service-card.enhanced.animations-enabled::before {
        animation-play-state: var(--border-animation-state, paused);
      }
      
      /* Hover otimizado apenas com transform */
      .cyber-service-card.enhanced:hover {
        transform: translate3d(0, -10px, 0) scale(1.02);
      }
      
      /* Preload de transforms para evitar jank */
      .cyber-service-icon,
      .cyber-tag {
        will-change: auto;
      }
      
      .cyber-service-card.enhanced:hover .cyber-service-icon,
      .cyber-service-card.enhanced:hover .cyber-tag {
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Método público para cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.cards.clear();
    this.isInitialized = false;
  }
  
  // Método para atualizar cache quando necessário
  updateCache() {
    this.domCache.serviceCards.forEach(card => {
      const cardData = this.cards.get(card);
      if (cardData) {
        cardData.boundingRect = card.getBoundingClientRect();
      }
    });
  }
}

// Instância global otimizada
let optimizedServiceCards = null;

function initOptimizedServiceCards() {
  // Inicializar apenas se há cards de serviço na página
  if (document.querySelector('.cyber-service-card.enhanced')) {
    optimizedServiceCards = new OptimizedServiceCards();
  }
}

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
  if (optimizedServiceCards) {
    optimizedServiceCards.destroy();
  }
});

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
  // Inicializar service cards após DOM estar pronto
  setTimeout(() => {
    initOptimizedServiceCards();
  }, 100);
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
      progressFill.classList.add("progress-60");
    }, 100);
    setTimeout(() => {
      progressFill.classList.remove("progress-60");
      progressFill.classList.add("progress-100");
    }, 1000);
  }
  const hidePreloader = () => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.classList.add("is-hidden");
      loader.classList.add("hidden");
      loader.setAttribute("aria-hidden", "true");
      // Remove do DOM após animação para liberar memória
      loader.parentNode && loader.parentNode.removeChild(loader);
      document.body.classList.remove("is-locked");
      document.body.classList.add("is-unlocked");
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
          // Cache counters locais para evitar múltiplos querySelectorAll
          const counters =
            entry.target._counters ||
            (entry.target._counters = entry.target.querySelectorAll(
              ".counter:not(.counted)"
            ));
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

  // Observar elementos com animações (cache global)
  const revealElements =
    DOMCache._revealElements ||
    (DOMCache._revealElements = document.querySelectorAll(
      ".reveal, .cyber-metric-card"
    ));
  revealElements.forEach((element) => {
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
  // Cache selectors para evitar múltiplos acessos ao DOM
  const scrollIndicator =
    DOMCache._scrollIndicator ||
    (DOMCache._scrollIndicator = document.querySelector(".scroll-indicator"));
  if (scrollIndicator) {
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    scrollIndicator.style.transform = `scaleX(${scrollPercentage / 100})`;
  }

  const header =
    DOMCache.header || (DOMCache.header = document.querySelector("header"));
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
  // Cache selectors para evitar múltiplos acessos ao DOM
  const sections =
    DOMCache._sections ||
    (DOMCache._sections = document.querySelectorAll("section[id]"));
  let currentSection = "";
  const scrollPosition = window.scrollY;
  const header =
    DOMCache.header || (DOMCache.header = document.querySelector("header"));
  const headerHeight = header?.offsetHeight || 0;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (
      scrollPosition >= sectionTop - headerHeight - 100 &&
      scrollPosition < sectionTop + sectionHeight - headerHeight - 100
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  const navLinks =
    DOMCache._navLinks ||
    (DOMCache._navLinks = document.querySelectorAll(
      ".cyber-nav-link, .mobile-nav a"
    ));
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
      // "carousel-nav", "chatbot-toggle", "chatbot-send" removidos pois não existem implementações
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
    mobileNav.classList.add("active", "translate-x-0");
    mobileNav.classList.remove("translate-x-full");
    document.body.classList.add("is-locked");
    document.body.classList.remove("is-unlocked");
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.add("active", "is-visible");
      mobileNavOverlay.classList.remove("is-hidden");
      mobileNavOverlay.setAttribute("aria-hidden", "false");
    }
    // Foco automático no menu para acessibilidade
    setTimeout(() => {
      mobileNav.setAttribute("tabindex", "-1");
      mobileNav.focus();
    }, 10);
  } else {
    mobileNav.classList.remove("active", "translate-x-0");
    mobileNav.classList.add("translate-x-full");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-unlocked");
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.remove("active", "is-visible");
      mobileNavOverlay.classList.add("is-hidden");
      mobileNavOverlay.setAttribute("aria-hidden", "true");
    }
    mobileNav.removeAttribute("tabindex");
  }
}

function handleFaqToggle(question) {
  // Encontrar o item FAQ pai (que contém tanto a pergunta quanto a resposta)
  const faqItem = question.closest('.cyber-faq-enhanced-item');
  if (!faqItem) return;
  
  const isItemOpen = faqItem.classList.contains('active');
  
  // Fechar todas as outras perguntas
  const allFaqItems = document.querySelectorAll('.cyber-faq-enhanced-item');
  allFaqItems.forEach((item) => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Alternar estado atual
  if (isItemOpen) {
    faqItem.classList.remove('active');
  } else {
    faqItem.classList.add('active');
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
    DOMCache.cursor.classList.add("translate-cursor");
    DOMCache.cursor.style.transform = `translate(${x}px, ${y}px)`;
    DOMCache.cursorDot.classList.add("translate-cursor");
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
    if (!DOMCache._cursorListeners) {
      function isElementOrDescendant(el) {
        // Garante que el é um Element e não um Text, Document, etc
        return el && typeof el.matches === "function";
      }
      document.addEventListener(
        "mouseenter",
        (e) => {
          const target = e.target;
          if (
            isElementOrDescendant(target) &&
            target.matches(
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
          const target = e.target;
          if (
            isElementOrDescendant(target) &&
            target.matches(
              "a, button, input, select, textarea, .cursor-pointer"
            )
          ) {
            DOMCache.cursor.classList.remove("active");
            DOMCache.cursorDot.classList.remove("active");
          }
        },
        true
      );
      DOMCache._cursorListeners = true;
    }
  } else {
    // Em dispositivos móveis, ocultar cursor customizado
    if (DOMCache.cursor) DOMCache.cursor.classList.add("is-hidden");
    if (DOMCache.cursorDot) DOMCache.cursorDot.classList.add("is-hidden");
  }
}

// ========================================
// CONTADORES
// ========================================

function initCounters() {
  // Cache counters para evitar múltiplos acessos ao DOM
  const counters =
    DOMCache._counters ||
    (DOMCache._counters = document.querySelectorAll(".counter:not(.counted)"));
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

  // Cache global de imagens para evitar múltiplos querySelectorAll
  const lazyImages =
    DOMCache._lazyImages ||
    (DOMCache._lazyImages = document.querySelectorAll(
      "img[data-src]:not(.loaded)"
    ));

  // Verificar suporte nativo
  if ("loading" in HTMLImageElement.prototype) {
    // Usar loading="lazy" nativo com fallback otimizado
    lazyImages.forEach((img) => {
      if (!loadedImages.has(img.src)) {
        img.loading = "lazy";
        loadImage(img);
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
            loadImage(entry.target);
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

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback sem IntersectionObserver
    lazyImages.forEach((img) => {
      if (!loadedImages.has(img.src)) {
        loadImage(img);
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
    img.classList.add("is-blur");
  }
  if (particlesContainer) particlesContainer.classList.add("is-hidden");

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
    // Flex container (mantém para desktop)
    const flexContainer = card.querySelector(".flex");
    if (flexContainer) {
      flexContainer.style.display = "flex";
      flexContainer.style.alignItems = "center";
      flexContainer.style.gap = "0.75rem";
    }

    statsWrapper.appendChild(card);

    // Efeito touch: usa classe utilitária
    card.addEventListener("touchstart", () => {
      card.classList.add("card-active");
    });
    card.addEventListener("touchend", () => {
      card.classList.remove("card-active");
    });
  });
}

function setupInteractiveCards() {
  const cards = document.querySelectorAll(".cyber-stats-card");

  cards.forEach((card) => {
    card.classList.add("fade-init");
    card.addEventListener("touchstart", () => {
      card.classList.add("card-active");
    });
    card.addEventListener("touchend", () => {
      card.classList.remove("card-active");
    });
    setTimeout(() => {
      card.classList.remove("fade-init");
      card.classList.add("fade-in-scale");
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
  // Adiciona classe de transição CSS
  carouselWrapper.classList.add("carousel-transition");

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
    carouselWrapper.classList.remove("carousel-transition");
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

    carouselWrapper.classList.add("carousel-transition");
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
    if (avatar) avatar.classList.add("team-avatar-hover");
    if (roleIndicator) roleIndicator.classList.add("team-role-hover");
    skills.forEach((skill, skillIndex) => {
      setTimeout(() => {
        skill.classList.add("team-skill-hover");
      }, skillIndex * 100);
    });
  } else {
    if (avatar) avatar.classList.remove("team-avatar-hover");
    if (roleIndicator) roleIndicator.classList.remove("team-role-hover");
    skills.forEach((skill) => {
      skill.classList.remove("team-skill-hover");
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

    // node.addEventListener("click", () => {
    //   console.log("Matrix node clicked:", node.dataset.skill);
    // });
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
    core.style.setProperty("--matrix-node-color", color);
    core.classList.add("matrix-node-hover");
  }
  if (label) {
    label.style.setProperty("--matrix-node-color", color);
    label.classList.add("matrix-label-hover");
  }
}

function resetMatrixNode(node) {
  const core = node.querySelector(".cyber-node-core");
  const label = node.querySelector(".cyber-node-label");
  if (core) {
    core.classList.remove("matrix-node-hover");
    core.style.removeProperty("--matrix-node-color");
  }
  if (label) {
    label.classList.remove("matrix-label-hover");
    label.style.removeProperty("--matrix-node-color");
  }
}

function setupAvatarAnimations(avatars) {
  avatars.forEach((avatar) => {
    avatar.classList.add("avatar-tilt");
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
    card.classList.add("fade-init-up", `delay-${index}`);
    // Remove fade-init-up e adiciona fade-in-up após o repaint (CSS faz o delay)
    requestAnimationFrame(() => {
      card.classList.remove("fade-init-up");
      card.classList.add("fade-in-up");
    });
  });

  matrixNodes.forEach((node, index) => {
    node.classList.add("fade-init-up", `delay-${index}`);
    requestAnimationFrame(() => {
      node.classList.remove("fade-init-up");
      node.classList.add("fade-in-up");
    });
  });
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
      // console.log("FCP:", fcpEntry.startTime.toFixed(2), "ms");
    }
  });
  fcpObserver.observe({ entryTypes: ["paint"] });

  const lcpObserver = new PerformanceObserver((list) => {
    const lcpEntry = list.getEntries()[list.getEntries().length - 1];
    // console.log("LCP:", lcpEntry.startTime.toFixed(2), "ms");
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

// ========================================
// MOBILE SERVICES CAROUSEL SYSTEM
// ========================================
class MobileServicesCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.track = null;
    this.dots = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    this.track = document.querySelector('.carousel-track');
    this.dots = document.querySelectorAll('.dot');
    
    if (!this.track || !this.dots.length) return;
    
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoplay();
  }

  setupEventListeners() {
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });

    // Touch navigation
    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.stopAutoplay();
    });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
      this.startAutoplay();
    });

    // Mouse navigation (for desktop testing)
    this.track.addEventListener('mousedown', (e) => {
      this.touchStartX = e.clientX;
      this.stopAutoplay();
    });

    this.track.addEventListener('mouseup', (e) => {
      this.touchEndX = e.clientX;
      this.handleSwipe();
      this.startAutoplay();
    });

    // Pause autoplay on hover
    const carousel = document.querySelector('.mobile-services-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        this.previousSlide();
      } else {
        this.nextSlide();
      }
    }
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  updateCarousel() {
    if (!this.track) return;
    
    const cardWidth = 300; // Aproximadamente a largura do card + gap
    const offset = -(this.currentSlide * cardWidth);
    
    this.track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 segundos
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize on all devices
  new MobileServicesCarousel();
});

// Re-initialize on resize
let carouselInstance = null;
window.addEventListener('resize', () => {
  if (!carouselInstance) {
    carouselInstance = new MobileServicesCarousel();
  }
});
