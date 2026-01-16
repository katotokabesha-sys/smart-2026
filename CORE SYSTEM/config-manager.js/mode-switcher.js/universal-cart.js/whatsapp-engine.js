class AdBarEngine {
    constructor() {
        this.ads = [];
        this.currentAdIndex = 0;
        this.isActive = true;
        this.animationSpeed = 30; // secondes pour un cycle complet
        this.init();
    }

    init() {
        this.loadAds();
        this.createAdBar();
        this.startAnimation();
        this.setupControls();
        this.setupAdminControls();
    }

    createAdBar() {
        const adBarHTML = `
            <div class="ad-bar-container ${this.isActive ? 'active' : 'inactive'}">
                <div class="ad-bar-header">
                    <span class="ad-title">
                        <i>📢</i> PRODUITS EN STOCK
                    </span>
                    <div class="ad-controls">
                        <button class="ad-control-btn play-btn" title="Démarrer">
                            <i>▶️</i>
                        </button>
                        <button class="ad-control-btn pause-btn" title="Pause">
                            <i>⏸️</i>
                        </button>
                        <button class="ad-control-btn speed-btn" title="Vitesse">
                            <i>⚡</i>
                        </button>
                        <button class="ad-control-btn close-btn" title="Masquer">
                            <i>❌</i>
                        </button>
                    </div>
                </div>
                <div class="ad-track">
                    <div class="ad-slider" id="adSlider">
                        ${this.generateAdSlides()}
                    </div>
                </div>
                <div class="ad-indicators" id="adIndicators">
                    ${this.generateIndicators()}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', adBarHTML);
    }

    generateAdSlides() {
        return this.ads.map((ad, index) => `
            <div class="ad-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="ad-content">
                    <div class="ad-image">
                        <img src="${ad.image}" alt="${ad.name}" loading="lazy">
                        <div class="ad-badge stock-badge">EN STOCK</div>
                    </div>
                    <div class="ad-info">
                        <h3 class="ad-product-name">${ad.name}</h3>
                        <div class="ad-product-price">${this.formatPrice(ad.price)} FCFA</div>
                        <div class="ad-product-stock">
                            <span class="stock-available">${ad.quantity} disponibles</span>
                        </div>
                        <div class="ad-actions">
                            <button class="ad-action-btn buy-btn" data-id="${ad.id}">
                                <i>💰</i> Acheter maintenant
                            </button>
                            <button class="ad-action-btn details-btn" data-id="${ad.id}">
                                <i>🔍</i> Détails
                            </button>
                        </div>
                    </div>
                    <div class="ad-timer">
                        <div class="timer-progress" data-index="${index}"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateIndicators() {
        return this.ads.map((_, index) => `
            <button class="ad-indicator ${index === 0 ? 'active' : ''}" 
                    data-index="${index}"
                    title="Produit ${index + 1}">
                <span class="indicator-dot"></span>
            </button>
        `).join('');
    }

    startAnimation() {
        if (!this.isActive) return;

        const slider = document.getElementById('adSlider');
        if (!slider) return;

        // Animation CSS
        slider.style.animation = `slideAds ${this.animationSpeed}s linear infinite`;
        
        // Mettre à jour les timers
        this.startTimers();
        
        // Gestion des transitions
        slider.addEventListener('animationiteration', () => {
            this.nextAd();
        });
    }

    startTimers() {
        // Réinitialiser tous les timers
        document.querySelectorAll('.timer-progress').forEach(timer => {
            timer.style.animation = 'none';
            void timer.offsetWidth; // Trigger reflow
            timer.style.animation = `timerProgress ${this.animationSpeed / this.ads.length}s linear`;
        });
    }

    nextAd() {
        const currentSlide = document.querySelector('.ad-slide.active');
        const currentIndicator = document.querySelector('.ad-indicator.active');
        
        // Désactiver le courant
        if (currentSlide) currentSlide.classList.remove('active');
        if (currentIndicator) currentIndicator.classList.remove('active');
        
        // Calculer le suivant
        this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
        
        // Activer le suivant
        const nextSlide = document.querySelector(`.ad-slide[data-index="${this.currentAdIndex}"]`);
        const nextIndicator = document.querySelector(`.ad-indicator[data-index="${this.currentAdIndex}"]`);
        
        if (nextSlide) nextSlide.classList.add('active');
        if (nextIndicator) nextIndicator.classList.add('active');
        
        // Émettre un événement
        this.dispatchAdChange();
    }

    gotoAd(index) {
        if (index < 0 || index >= this.ads.length) return;
        
        // Arrêter l'animation
        this.pauseAnimation();
        
        // Mettre à jour l'index
        this.currentAdIndex = index;
        
        // Mettre à jour l'affichage
        document.querySelectorAll('.ad-slide').forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        document.querySelectorAll('.ad-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Redémarrer l'animation
        setTimeout(() => this.resumeAnimation(), 100);
    }

    pauseAnimation() {
        const slider = document.getElementById('adSlider');
        if (slider) {
            slider.style.animationPlayState = 'paused';
        }
        document.querySelectorAll('.timer-progress').forEach(timer => {
            timer.style.animationPlayState = 'paused';
        });
    }

    resumeAnimation() {
        const slider = document.getElementById('adSlider');
        if (slider) {
            slider.style.animationPlayState = 'running';
        }
        document.querySelectorAll('.timer-progress').forEach(timer => {
            timer.style.animationPlayState = 'running';
        });
    }

    setupControls() {
        // Play/Pause
        document.querySelector('.play-btn')?.addEventListener('click', () => this.resumeAnimation());
        document.querySelector('.pause-btn')?.addEventListener('click', () => this.pauseAnimation());
        
        // Vitesse
        document.querySelector('.speed-btn')?.addEventListener('click', () => this.changeSpeed());
        
        // Fermer
        document.querySelector('.close-btn')?.addEventListener('click', () => this.toggleAdBar());
        
        // Indicateurs
        document.querySelectorAll('.ad-indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.gotoAd(index);
            });
        });
        
        // Actions sur les produits
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.handleBuyClick(productId);
            });
        });
    }

    changeSpeed() {
        const speeds = [15, 30, 45, 60]; // secondes
        const currentIndex = speeds.indexOf(this.animationSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        
        this.animationSpeed = speeds[nextIndex];
        
        // Mettre à jour l'animation
        this.pauseAnimation();
        this.startAnimation();
        
        // Afficher la notification
        this.showNotification(`Vitesse publicité: ${this.animationSpeed}s`);
    }

    toggleAdBar() {
        const container = document.querySelector('.ad-bar-container');
        container.classList.toggle('inactive');
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            this.resumeAnimation();
        } else {
            this.pauseAnimation();
        }
    }

    handleBuyClick(productId) {
        // Trouver le produit
        const product = this.ads.find(ad => ad.id === productId);
        if (!product) return;
        
        // Ajouter au panier
        window.cartManager?.addProduct(product);
        
        // Afficher confirmation
        this.showNotification(`"${product.name}" ajouté au panier!`);
        
        // Suivi analytics
        this.trackAdConversion(product);
    }

    setupAdminControls() {
        // Panel admin pour gérer la barre pub
        const adminHTML = `
            <div class="ad-admin-panel">
                <h3><i>⚙️</i> Gestion Barre Publicitaire</h3>
                <div class="admin-controls">
                    <button class="admin-btn add-ad-btn">
                        <i>➕</i> Ajouter produit
                    </button>
                    <button class="admin-btn remove-ad-btn">
                        <i>🗑️</i> Retirer produit
                    </button>
                    <button class="admin-btn reorder-ads-btn">
                        <i>↕️</i> Réorganiser
                    </button>
                    <button class="admin-btn ad-settings-btn">
                        <i>⚙️</i> Paramètres
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter au panel admin principal
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.insertAdjacentHTML('beforeend', adminHTML);
        }
    }

    loadAds() {
        // Charger depuis l'API ou localStorage
        const savedAds = localStorage.getItem('lbk_ad_bar_ads');
        if (savedAds) {
            this.ads = JSON.parse(savedAds);
        } else {
            // Charger par défaut les produits en stock
            this.loadStockProductsAsAds();
        }
    }

    loadStockProductsAsAds() {
        const stockProducts = JSON.parse(localStorage.getItem('lbk_stock_products') || '[]');
        this.ads = stockProducts
            .filter(product => product.quantity > 0)
            .slice(0, 10) // Maximum 10 produits
            .map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity,
                category: product.category
            }));
        
        this.saveAds();
    }

    saveAds() {
        localStorage.setItem('lbk_ad_bar_ads', JSON.stringify(this.ads));
    }

    // Utilitaires
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ad-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i>📢</i> ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    trackAdConversion(product) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_conversion', {
                'event_category': 'advertising',
                'event_label': product.name,
                'value': product.price
            });
        }
    }

    dispatchAdChange() {
        const event = new CustomEvent('adChanged', {
            detail: {
                ad: this.ads[this.currentAdIndex],
                index: this.currentAdIndex
            }
        });
        window.dispatchEvent(event);
    }
}

// Initialisation
window.adBarEngine = new AdBarEngine();
