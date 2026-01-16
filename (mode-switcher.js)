class ModeManager {
    constructor() {
        this.currentMode = this.detectInitialMode();
        this.init();
    }

    detectInitialMode() {
        // Règle 1: Vérifier la taille d'écran
        if (window.innerWidth <= 768) {
            return 'mobile';
        }
        
        // Règle 2: Vérifier user agent
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
            return 'mobile';
        }
        
        // Règle 3: Vérifier localStorage
        const savedMode = localStorage.getItem('lbk_preferred_mode');
        if (savedMode) return savedMode;
        
        // Règle 4: Vérifier l'heure (mobile le soir)
        const hour = new Date().getHours();
        if (hour >= 18 || hour <= 8) {
            return 'mobile'; // Utilisation mobile préférée le soir
        }
        
        return 'desktop'; // Par défaut
    }

    init() {
        this.createModeSwitchUI();
        this.applyMode(this.currentMode);
        this.setupEventListeners();
        this.setupAnalytics();
    }

    createModeSwitchUI() {
        const switchHTML = `
            <div class="mode-switcher-container">
                <div class="mode-switcher">
                    <button class="mode-btn active" data-mode="desktop">
                        <i class="mode-icon">🖥️</i>
                        <span class="mode-label">Bureau</span>
                    </button>
                    <button class="mode-btn" data-mode="mobile">
                        <i class="mode-icon">📱</i>
                        <span class="mode-label">Mobile</span>
                    </button>
                </div>
                <div class="mode-indicator">
                    <span class="current-mode">${this.currentMode === 'desktop' ? 'Mode Bureau' : 'Mode Mobile'}</span>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', switchHTML);
    }

    applyMode(mode) {
        // Supprimer les classes précédentes
        document.body.classList.remove('desktop-mode', 'mobile-mode');
        
        // Ajouter la nouvelle classe
        document.body.classList.add(`${mode}-mode`);
        
        // Mettre à jour l'interface
        this.updateButtons(mode);
        
        // Charger les ressources spécifiques au mode
        this.loadModeResources(mode);
        
        // Sauvegarder la préférence
        localStorage.setItem('lbk_preferred_mode', mode);
        
        // Mettre à jour le titre
        document.title = `LB-K SMART ${mode === 'desktop' ? '| Bureau' : '| Mobile'}`;
        
        // Émettre un événement
        this.dispatchModeChange(mode);
    }

    loadModeResources(mode) {
        // Charger CSS spécifique
        const existingModeCSS = document.getElementById('mode-specific-css');
        if (existingModeCSS) existingModeCSS.remove();
        
        const cssLink = document.createElement('link');
        cssLink.id = 'mode-specific-css';
        cssLink.rel = 'stylesheet';
        cssLink.href = `assets/css/${mode}-mode.css`;
        document.head.appendChild(cssLink);
        
        // Charger JS spécifique
        this.loadModeScript(mode);
    }

    loadModeScript(mode) {
        // Décharger l'ancien script s'il existe
        const oldScript = document.getElementById('mode-specific-script');
        if (oldScript) oldScript.remove();
        
        // Charger le nouveau script
        const script = document.createElement('script');
        script.id = 'mode-specific-script';
        script.src = `assets/js/${mode}-mode.js`;
        script.defer = true;
        document.head.appendChild(script);
    }

    toggleMode() {
        const newMode = this.currentMode === 'desktop' ? 'mobile' : 'desktop';
        this.currentMode = newMode;
        this.applyMode(newMode);
        
        // Animation de transition
        this.playTransitionAnimation();
    }

    playTransitionAnimation() {
        const transition = document.createElement('div');
        transition.className = 'mode-transition-overlay';
        transition.innerHTML = `
            <div class="transition-content">
                <div class="spinner"></div>
                <p>Chargement du mode ${this.currentMode === 'desktop' ? 'Bureau' : 'Mobile'}...</p>
            </div>
        `;
        
        document.body.appendChild(transition);
        
        setTimeout(() => {
            transition.remove();
        }, 1000);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mode-btn')) {
                const mode = e.target.closest('.mode-btn').dataset.mode;
                if (mode !== this.currentMode) {
                    this.currentMode = mode;
                    this.applyMode(mode);
                }
            }
        });
        
        // Raccourci clavier: Ctrl+M pour basculer
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggleMode();
            }
        });
        
        // Détection automatique de changement de taille
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        const width = window.innerWidth;
        const shouldBeMobile = width <= 768;
        const currentIsMobile = this.currentMode === 'mobile';
        
        if (shouldBeMobile !== currentIsMobile) {
            // Demander confirmation pour changer de mode
            if (confirm(`Passer en mode ${shouldBeMobile ? 'Mobile' : 'Bureau'} ?`)) {
                this.currentMode = shouldBeMobile ? 'mobile' : 'desktop';
                this.applyMode(this.currentMode);
            }
        }
    }

    setupAnalytics() {
        // Suivi des changements de mode
        window.addEventListener('modeChanged', (e) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mode_switch', {
                    'event_category': 'user_preference',
                    'event_label': e.detail.mode,
                    'value': 1
                });
            }
        });
    }

    dispatchModeChange(mode) {
        const event = new CustomEvent('modeChanged', {
            detail: { mode, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }

    updateButtons(mode) {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Mettre à jour l'indicateur
        const indicator = document.querySelector('.current-mode');
        if (indicator) {
            indicator.textContent = mode === 'desktop' ? 'Mode Bureau' : 'Mode Mobile';
        }
    }

    // API publique
    getCurrentMode() { return this.currentMode; }
    isDesktopMode() { return this.currentMode === 'desktop'; }
    isMobileMode() { return this.currentMode === 'mobile'; }
}

// Initialisation globale
window.modeManager = new ModeManager();
