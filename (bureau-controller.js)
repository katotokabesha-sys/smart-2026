class BureauController {
    constructor() {
        this.sections = {
            catalogue: null,
            stock: null
        };
        this.currentView = 'dual'; // dual, catalogue-only, stock-only
        this.init();
    }

    init() {
        this.createBureauStructure();
        this.loadSections();
        this.setupDragAndDrop();
        this.setupViewControls();
        this.startDataSync();
    }

    createBureauStructure() {
        const bureauHTML = `
            <div class="bureau-root">
                <!-- En-tête du bureau -->
                <div class="bureau-header">
                    <h1 class="bureau-title">
                        <span class="title-icon">🏢</span>
                        BUREAU LB-K SMART
                    </h1>
                    <div class="view-controls">
                        <button class="view-btn active" data-view="dual">
                            <i>📊</i> Vue Double
                        </button>
                        <button class="view-btn" data-view="catalogue">
                            <i>📦</i> Catalogue
                        </button>
                        <button class="view-btn" data-view="stock">
                            <i>🏪</i> Stock
                        </button>
                    </div>
                </div>

                <!-- Conteneur principal -->
                <div class="bureau-container">
                    <!-- Section Catalogue -->
                    <div class="bureau-section catalogue-section">
                        <div class="section-header">
                            <h2>
                                <span class="section-icon">📦</span>
                                CATALOGUE / COMMANDES EN LIGNE
                                <span class="section-badge">${this.getCatalogueCount()} produits</span>
                            </h2>
                            <div class="section-actions">
                                <button class="action-btn filter-btn">
                                    <i>🔍</i> Filtrer
                                </button>
                                <button class="action-btn sort-btn">
                                    <i>↕️</i> Trier
                                </button>
                                <button class="action-btn search-btn">
                                    <i>🔎</i> Rechercher
                                </button>
                            </div>
                        </div>
                        <div class="products-grid" id="catalogueGrid">
                            <!-- Produits chargés dynamiquement -->
                        </div>
                    </div>

                    <!-- Séparateur redimensionnable -->
                    <div class="section-divider" id="sectionDivider">
                        <div class="divider-handle">
                            <i>↔️</i>
                        </div>
                    </div>

                    <!-- Section Stock -->
                    <div class="bureau-section stock-section">
                        <div class="section-header">
                            <h2>
                                <span class="section-icon">🏪</span>
                                STOCK DISPONIBLE SUR PLACE
                                <span class="section-badge stock-badge">${this.getStockCount()} en stock</span>
                            </h2>
                            <div class="section-actions">
                                <button class="action-btn add-stock-btn">
                                    <i>➕</i> Ajouter
                                </button>
                                <button class="action-btn refresh-stock-btn">
                                    <i>🔄</i> Actualiser
                                </button>
                                <button class="action-btn highlight-stock-btn">
                                    <i>⭐</i> Mettre en avant
                                </button>
                            </div>
                        </div>
                        <div class="products-grid" id="stockGrid">
                            <!-- Produits en stock chargés dynamiquement -->
                        </div>
                    </div>
                </div>

                <!-- Barre d'état -->
                <div class="bureau-status-bar">
                    <div class="status-item">
                        <span class="status-label">Total produits:</span>
                        <span class="status-value" id="totalProducts">0</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">En stock:</span>
                        <span class="status-value stock-value" id="availableStock">0</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">En commande:</span>
                        <span class="status-value order-value" id="pendingOrders">0</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Valeur stock:</span>
                        <span class="status-value value-value" id="stockValue">0 FCFA</span>
                    </div>
                </div>
            </div>
        `;

        const mainContainer = document.getElementById('mainContainer') || document.body;
        mainContainer.innerHTML = bureauHTML;
    }

    loadSections() {
        // Charger catalogue
        this.loadCatalogueSection();
        
        // Charger stock
        this.loadStockSection();
        
        // Mettre à jour les compteurs
        this.updateCounters();
        
        // Démarrer les animations 3D
        this.init3DEffects();
    }

    loadCatalogueSection() {
        const catalogueGrid = document.getElementById('catalogueGrid');
        if (!catalogueGrid) return;

        // Charger depuis l'API ou le localStorage
        const catalogueProducts = this.getCatalogueProducts();
        
        catalogueGrid.innerHTML = catalogueProducts.map(product => `
            <div class="product-card catalogue-card" data-id="${product.id}" data-category="${product.category}">
                <div class="product-badge order-badge">🟡 Commande</div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" 
                         class="product-image" 
                         loading="lazy"
                         data-src="${product.image}">
                    <div class="image-overlay">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i>👁️</i> Voir détails
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-category">${this.getCategoryIcon(product.category)} ${product.category}</div>
                    <div class="product-price">${this.formatPrice(product.price)} FCFA</div>
                    <div class="product-delivery">
                        <i>⏱️</i> ${product.deliveryTime || '15-21 jours'}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="action-btn add-to-cart-btn" data-id="${product.id}">
                        <i>🛒</i> Ajouter
                    </button>
                    <button class="action-btn quick-order-btn" data-id="${product.id}">
                        <i>⚡</i> Commander
                    </button>
                </div>
            </div>
        `).join('');

        // Activer les événements
        this.activateCatalogueEvents();
    }

    loadStockSection() {
        const stockGrid = document.getElementById('stockGrid');
        if (!stockGrid) return;

        const stockProducts = this.getStockProducts();
        
        stockGrid.innerHTML = stockProducts.map(product => `
            <div class="product-card stock-card" data-id="${product.id}" data-stock="${product.quantity}">
                <div class="product-badge stock-badge">🟢 Stock</div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" 
                         class="product-image stock-image"
                         loading="lazy">
                    <div class="stock-indicator">
                        <div class="stock-level" style="width: ${Math.min(100, (product.quantity / product.maxQuantity) * 100)}%"></div>
                        <span class="stock-count">${product.quantity} unités</span>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-category">${this.getCategoryIcon(product.category)} ${product.category}</div>
                    <div class="product-price stock-price">${this.formatPrice(product.price)} FCFA</div>
                    <div class="product-location">
                        <i>📍</i> ${product.location || 'Entrepôt principal'}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="action-btn sell-btn" data-id="${product.id}">
                        <i>💰</i> Vendre
                    </button>
                    <button class="action-btn adjust-stock-btn" data-id="${product.id}">
                        <i>📊</i> Ajuster
                    </button>
                </div>
            </div>
        `).join('');

        // Activer les événements stock
        this.activateStockEvents();
    }

    getCategoryIcon(category) {
        const icons = {
            'pharmacie': '💊',
            'habillement': '👕',
            'electronique': '📱',
            'electromenager': '🏠',
            'cosmétiques': '💄',
            'auto-pieces': '🚗'
        };
        return icons[category] || '📦';
    }

    setupDragAndDrop() {
        const divider = document.getElementById('sectionDivider');
        let isDragging = false;

        divider.addEventListener('mousedown', (e) => {
            isDragging = true;
            document.body.style.cursor = 'ew-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const bureauContainer = document.querySelector('.bureau-container');
            const containerRect = bureauContainer.getBoundingClientRect();
            const newLeftPercentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Limiter entre 30% et 70%
            const clampedPercentage = Math.max(30, Math.min(70, newLeftPercentage));
            
            bureauContainer.style.gridTemplateColumns = `${clampedPercentage}fr 10px ${100 - clampedPercentage - 10}fr`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = '';
        });
    }

    setupViewControls() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
                
                // Mettre à jour les boutons actifs
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        const container = document.querySelector('.bureau-container');
        const divider = document.getElementById('sectionDivider');

        switch(view) {
            case 'dual':
                container.classList.remove('catalogue-only', 'stock-only');
                divider.style.display = 'block';
                break;
            case 'catalogue':
                container.classList.add('catalogue-only');
                container.classList.remove('stock-only');
                divider.style.display = 'none';
                break;
            case 'stock':
                container.classList.add('stock-only');
                container.classList.remove('catalogue-only');
                divider.style.display = 'none';
                break;
        }
    }

    init3DEffects() {
        // Effet de parallaxe
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', this.handleCard3DEffect.bind(this));
            card.addEventListener('mouseleave', this.resetCard3DEffect.bind(this));
        });
    }

    handleCard3DEffect(e) {
        const card = e.currentTarget;
        const cardRect = card.getBoundingClientRect();
        
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;
        
        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 5; // Rotation max 5 degrés
        const rotateX = ((centerY - y) / centerY) * 5;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
        
        // Effet d'ombre dynamique
        const shadowX = (x - centerX) / 10;
        const shadowY = (y - centerY) / 10;
        const shadowBlur = 20;
        
        card.style.boxShadow = `
            ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3)
        `;
    }

    resetCard3DEffect(e) {
        const card = e.currentTarget;
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    startDataSync() {
        // Synchronisation en temps réel
        setInterval(() => {
            this.updateCounters();
            this.refreshStockDisplay();
        }, 30000); // Toutes les 30 secondes

        // Écouter les changements
        window.addEventListener('stockUpdated', () => this.refreshStockDisplay());
        window.addEventListener('orderPlaced', () => this.updateCounters());
    }

    updateCounters() {
        const catalogueCount = this.getCatalogueCount();
        const stockCount = this.getStockCount();
        const stockValue = this.calculateStockValue();
        const pendingOrders = this.getPendingOrdersCount();

        document.getElementById('totalProducts').textContent = catalogueCount + stockCount;
        document.getElementById('availableStock').textContent = stockCount;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('stockValue').textContent = this.formatPrice(stockValue) + ' FCFA';
    }

    // Méthodes utilitaires
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    getCatalogueProducts() {
        return JSON.parse(localStorage.getItem('lbk_catalogue_products') || '[]');
    }

    getStockProducts() {
        return JSON.parse(localStorage.getItem('lbk_stock_products') || '[]');
    }

    getCatalogueCount() {
        return this.getCatalogueProducts().length;
    }

    getStockCount() {
        return this.getStockProducts().length;
    }

    calculateStockValue() {
        const stockProducts = this.getStockProducts();
        return stockProducts.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }

    getPendingOrdersCount() {
        const orders = JSON.parse(localStorage.getItem('lbk_pending_orders') || '[]');
        return orders.length;
    }
}

// Initialisation
window.bureauController = new BureauController();
