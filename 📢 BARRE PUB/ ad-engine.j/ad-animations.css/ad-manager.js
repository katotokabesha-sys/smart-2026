class SmartCart {
    constructor() {
        this.items = [];
        this.variants = new Map();
        this.total = 0;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.createCartUI();
        this.setupEventListeners();
        this.setupAI();
    }

    createCartUI() {
        const cartHTML = `
            <div class="smart-cart-container">
                <div class="cart-header">
                    <h2 class="cart-title">
                        <i>🛒</i> PANIER INTELLIGENT
                        <span class="cart-count">${this.items.length} articles</span>
                    </h2>
                    <div class="cart-actions">
                        <button class="cart-action-btn ai-suggest-btn">
                            <i>🤖</i> Suggestions IA
                        </button>
                        <button class="cart-action-btn clear-cart-btn">
                            <i>🗑️</i> Vider
                        </button>
                        <button class="cart-action-btn close-cart-btn">
                            <i>✕</i>
                        </button>
                    </div>
                </div>

                <div class="cart-content">
                    <!-- Section des articles -->
                    <div class="cart-items-section" id="cartItemsSection">
                        ${this.generateCartItemsHTML()}
                    </div>

                    <!-- Panneau latéral -->
                    <div class="cart-sidebar">
                        <!-- Résumé -->
                        <div class="cart-summary">
                            <h3 class="summary-title">RÉSUMÉ DE LA COMMANDE</h3>
                            <div class="summary-details">
                                <div class="summary-row">
                                    <span>Sous-total:</span>
                                    <span class="subtotal-value">${this.formatPrice(this.calculateSubtotal())} FCFA</span>
                                </div>
                                <div class="summary-row">
                                    <span>Livraison:</span>
                                    <span class="shipping-value" id="shippingCost">0 FCFA</span>
                                </div>
                                <div class="summary-row total-row">
                                    <span><strong>TOTAL:</strong></span>
                                    <span class="total-value" id="cartTotal">${this.formatPrice(this.calculateTotal())} FCFA</span>
                                </div>
                            </div>
                        </div>

                        <!-- Options de livraison -->
                        <div class="shipping-options">
                            <h4><i>🚚</i> LIVRAISON</h4>
                            <div class="options-grid">
                                <label class="option-card">
                                    <input type="radio" name="shipping" value="air_express" checked>
                                    <div class="option-content">
                                        <i>✈️</i>
                                        <span class="option-name">Aérien Express</span>
                                        <span class="option-duration">15 jours</span>
                                        <span class="option-price">+25,000 FCFA</span>
                                    </div>
                                </label>
                                <label class="option-card">
                                    <input type="radio" name="shipping" value="air_normal">
                                    <div class="option-content">
                                        <i>🛫</i>
                                        <span class="option-name">Aérien Normal</span>
                                        <span class="option-duration">21 jours</span>
                                        <span class="option-price">+18,000 FCFA</span>
                                    </div>
                                </label>
                                <label class="option-card">
                                    <input type="radio" name="shipping" value="sea_cbm">
                                    <div class="option-content">
                                        <i>⛵</i>
                                        <span class="option-name">Maritime (CBM)</span>
                                        <span class="option-duration">30-45 jours</span>
                                        <span class="option-price">Calculé</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Assistant IA -->
                        <div class="cart-ai-assistant">
                            <h4><i>🤖</i> ASSISTANT IA</h4>
                            <div class="ai-suggestions" id="aiSuggestions">
                                <!-- Suggestions chargées dynamiquement -->
                            </div>
                            <button class="ai-chat-btn">
                                <i>💬</i> Chat avec l'assistant
                            </button>
                        </div>

                        <!-- Bouton final -->
                        <button class="checkout-btn" id="checkoutBtn">
                            <i>💬</i> ENVOYER SUR WHATSAPP
                            <span class="btn-arrow">→</span>
                        </button>
                    </div>
                </div>

                <!-- Éditeur de variantes -->
                <div class="variant-editor-modal" id="variantEditor">
                    <div class="variant-editor-content">
                        <h3><i>⚙️</i> Modifier les options</h3>
                        <div class="variant-options" id="variantOptions">
                            <!-- Options chargées dynamiquement -->
                        </div>
                        <div class="variant-actions">
                            <button class="variant-save-btn">Enregistrer</button>
                            <button class="variant-cancel-btn">Annuler</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    generateCartItemsHTML() {
        if (this.items.length === 0) {
            return `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <h3>Votre panier est vide</h3>
                    <p>Ajoutez des produits pour commencer</p>
                    <button class="browse-products-btn">
                        <i>🔍</i> Parcourir le catalogue
                    </button>
                </div>
            `;
        }

        return this.items.map((item, index) => `
            <div class="cart-item" data-index="${index}" data-id="${item.id}">
                <!-- Image et informations de base -->
                <div class="item-main">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        ${item.stock ? '<span class="stock-badge">STOCK</span>' : '<span class="order-badge">COMMANDE</span>'}
                    </div>
                    <div class="item-info">
                        <h4 class="item-name">${item.name}</h4>
                        <div class="item-category">${this.getCategoryIcon(item.category)} ${item.category}</div>
                        
                        <!-- Variantes actuelles -->
                        ${item.variants && Object.keys(item.variants).length > 0 ? `
                            <div class="item-variants">
                                ${Object.entries(item.variants).map(([key, value]) => `
                                    <span class="variant-tag">
                                        ${key}: <strong>${value}</strong>
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="item-price">
                            ${this.formatPrice(item.price)} FCFA
                            ${item.originalPrice ? `
                                <span class="original-price">${this.formatPrice(item.originalPrice)} FCFA</span>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Contrôles de quantité -->
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn minus-btn" data-index="${index}">
                            <i>−</i>
                        </button>
                        <input type="number" 
                               class="quantity-input" 
                               value="${item.quantity}" 
                               min="1" 
                               max="${item.maxQuantity || 99}"
                               data-index="${index}">
                        <button class="qty-btn plus-btn" data-index="${index}">
                            <i>+</i>
                        </button>
                    </div>
                    <div class="item-subtotal">
                        ${this.formatPrice(item.price * item.quantity)} FCFA
                    </div>
                </div>

                <!-- Actions -->
                <div class="item-actions">
                    <button class="item-action-btn edit-variants-btn" 
                            data-index="${index}"
                            title="Modifier les options">
                        <i>⚙️</i>
                    </button>
                    <button class="item-action-btn remove-item-btn" 
                            data-index="${index}"
                            title="Supprimer">
                        <i>🗑️</i>
                    </button>
                    <button class="item-action-btn save-item-btn" 
                            data-index="${index}"
                            title="Sauvegarder pour plus tard">
                        <i>💾</i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addItem(product, variants = {}, quantity = 1) {
        // Vérifier si le produit existe déjà avec les mêmes variantes
        const existingIndex = this.findItemIndex(product.id, variants);
        
        if (existingIndex !== -1) {
            // Mettre à jour la quantité
            this.items[existingIndex].quantity += quantity;
        } else {
            // Ajouter un nouvel article
            const cartItem = {
                ...product,
                quantity: quantity,
                variants: variants,
                addedAt: new Date().toISOString(),
                maxQuantity: product.stockQuantity || 99
            };
            
            this.items.push(cartItem);
            
            // Suivi analytics
            this.trackAddToCart(product, variants, quantity);
        }
        
        this.updateCart();
        this.showAddNotification(product, quantity);
        this.generateAISuggestions();
    }

    updateQuantity(index, change) {
        const item = this.items[index];
        if (!item) return;
        
        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            this.removeItem(index);
            return;
        }
        
        if (item.maxQuantity && newQuantity > item.maxQuantity) {
            this.showNotification(`Quantité maximale: ${item.maxQuantity}`);
            return;
        }
        
        item.quantity = newQuantity;
        this.updateCart();
    }

    editVariants(index) {
        const item = this.items[index];
        if (!item) return;
        
        const editor = document.getElementById('variantEditor');
        const optionsContainer = document.getElementById('variantOptions');
        
        // Générer les options basées sur la catégorie
        const variantTemplate = this.getVariantTemplate(item.category);
        optionsContainer.innerHTML = this.generateVariantForm(item, variantTemplate);
        
        // Afficher l'éditeur
        editor.style.display = 'flex';
        
        // Sauvegarder les modifications
        document.querySelector('.variant-save-btn').onclick = () => {
            this.saveVariants(index);
            editor.style.display = 'none';
        };
        
        // Annuler
        document.querySelector('.variant-cancel-btn').onclick = () => {
            editor.style.display = 'none';
        };
    }

    generateVariantForm(item, template) {
        return template.fields.map(field => `
            <div class="variant-field">
                <label>${field.label}</label>
                ${field.type === 'select' ? `
                    <select class="variant-select" data-field="${field.name}">
                        ${field.options.map(opt => `
                            <option value="${opt.value}" 
                                    ${item.variants[field.name] === opt.value ? 'selected' : ''}>
                                ${opt.label}
                            </option>
                        `).join('')}
                    </select>
                ` : `
                    <input type="${field.type}" 
                           class="variant-input" 
                           data-field="${field.name}"
                           value="${item.variants[field.name] || ''}"
                           ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}>
                `}
            </div>
        `).join('');
    }

    saveVariants(index) {
        const item = this.items[index];
        const inputs = document.querySelectorAll('.variant-field [data-field]');
        
        inputs.forEach(input => {
            const field = input.dataset.field;
            const value = input.type === 'select' ? input.value : input.value;
            item.variants[field] = value;
        });
        
        this.updateCart();
        this.showNotification('Options mises à jour');
    }

    removeItem(index) {
        const item = this.items[index];
        if (confirm(`Supprimer "${item.name}" du panier ?`)) {
            this.items.splice(index, 1);
            this.updateCart();
            this.showNotification('Produit supprimé');
        }
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    calculateShipping() {
        const shippingMethod = document.querySelector('input[name="shipping"]:checked')?.value;
        
        switch(shippingMethod) {
            case 'air_express':
                return 25000;
            case 'air_normal':
                return 18000;
            case 'sea_cbm':
                // Calcul basé sur le volume
                return this.calculateMaritimeShipping();
            default:
                return 0;
        }
    }

    calculateMaritimeShipping() {
        // Estimation basée sur le volume des produits
        let totalVolume = 0;
        
        this.items.forEach(item => {
            // Estimation du volume (en m³)
            const volume = item.dimensions ? 
                (item.dimensions.width * item.dimensions.height * item.dimensions.depth) / 1000000 :
                0.001; // 0.001 m³ par défaut
            
            totalVolume += volume * item.quantity;
        });
        
        // Tarif maritime: 150,000 FCFA par m³
        return Math.round(totalVolume * 150000);
    }

    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        return subtotal + shipping;
    }

    updateCart() {
        // Mettre à jour l'UI
        document.getElementById('cartItemsSection').innerHTML = this.generateCartItemsHTML();
        
        // Mettre à jour les totaux
        document.getElementById('shippingCost').textContent = 
            `${this.formatPrice(this.calculateShipping())} FCFA`;
        
        document.getElementById('cartTotal').textContent = 
            `${this.formatPrice(this.calculateTotal())} FCFA`;
        
        document.querySelector('.cart-count').textContent = 
            `${this.items.length} article${this.items.length > 1 ? 's' : ''}`;
        
        // Sauvegarder
        this.saveToStorage();
        
        // Émettre un événement
        this.dispatchCartUpdate();
    }

    setupAI() {
        // Initialiser l'assistant IA pour le panier
        this.aiAssistant = new CartAIAssistant(this);
        this.generateAISuggestions();
    }

    generateAISuggestions() {
        if (this.items.length === 0) return;
        
        const suggestions = this.aiAssistant.generateSuggestions(this.items);
        const container = document.getElementById('aiSuggestions');
        
        if (suggestions.length > 0) {
            container.innerHTML = suggestions.map(suggestion => `
                <div class="ai-suggestion ${suggestion.type}">
                    <div class="suggestion-icon">${suggestion.icon}</div>
                    <div class="suggestion-content">
                        <p class="suggestion-text">${suggestion.text}</p>
                        ${suggestion.action ? `
                            <button class="suggestion-action-btn" data-action="${suggestion.action}">
                                ${suggestion.actionText}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    // Utilitaires
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    findItemIndex(productId, variants) {
        return this.items.findIndex(item => {
            if (item.id !== productId) return false;
            
            // Comparer les variantes
            const itemVariants = JSON.stringify(item.variants || {});
            const newVariants = JSON.stringify(variants || {});
            
            return itemVariants === newVariants;
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showAddNotification(product, quantity) {
        this.showNotification(
            `${quantity}x "${product.name}" ajouté au panier`,
            'success'
        );
    }

    trackAddToCart(product, variants, quantity) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                'items': [{
                    'id': product.id,
                    'name': product.name,
                    'category': product.category,
                    'price': product.price,
                    'quantity': quantity
                }]
            });
        }
    }

    saveToStorage() {
        localStorage.setItem('lbk_smart_cart', JSON.stringify({
            items: this.items,
            updatedAt: new Date().toISOString()
        }));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('lbk_smart_cart');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.items = data.items || [];
            } catch (e) {
                console.error('Erreur chargement panier:', e);
                this.items = [];
            }
        }
    }

    dispatchCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                itemCount: this.items.length,
                total: this.calculateTotal(),
                items: this.items
            }
        });
        window.dispatchEvent(event);
    }

    getVariantTemplate(category) {
        // Retourne le template de variantes selon la catégorie
        const templates = {
            'habillement': {
                fields: [
                    { name: 'taille', label: 'Taille', type: 'select', options: [
                        { value: 'xs', label: 'XS' },
                        { value: 's', label: 'S' },
                        { value: 'm', label: 'M' },
                        { value: 'l', label: 'L' },
                        { value: 'xl', label: 'XL' },
                        { value: 'xxl', label: 'XXL' }
                    ]},
                    { name: 'couleur', label: 'Couleur', type: 'text', placeholder: 'Ex: Rouge, Bleu, Noir' },
                    { name: 'matiere', label: 'Matière', type: 'text', placeholder: 'Ex: Coton, Polyester' }
                ]
            },
            'electronique': {
                fields: [
                    { name: 'modele', label: 'Modèle', type: 'text' },
                    { name: 'couleur', label: 'Couleur', type: 'text' },
                    { name: 'capacite', label: 'Capacité', type: 'text', placeholder: 'Ex: 128GB, 256GB' }
                ]
            }
            // Ajouter d'autres catégories...
        };
        
        return templates[category] || { fields: [] };
    }
}

// Assistant IA pour le panier
class CartAIAssistant {
    constructor(cart) {
        this.cart = cart;
        this.recommendations = [];
    }

    generateSuggestions(cartItems) {
        const suggestions = [];
        
        // Suggestion 1: Articles fréquemment achetés ensemble
        suggestions.push({
            type: 'complementary',
            icon: '🔄',
            text: 'Les clients ayant acheté ces produits prennent aussi souvent: Chargeur rapide',
            action: 'add_complementary',
            actionText: 'Ajouter'
        });
        
        // Suggestion 2: Économies sur les packs
        if (cartItems.length >= 3) {
            suggestions.push({
                type: 'saving',
                icon: '💰',
                text: 'Économisez 15% en achetant le pack complet',
                action: 'apply_pack_discount',
                actionText: 'Appliquer'
            });
        }
        
        // Suggestion 3: Livraison optimisée
        suggestions.push({
            type: 'shipping',
            icon: '🚚',
            text: 'Ajoutez 5,000 FCFA de plus pour bénéficier de la livraison gratuite',
            action: 'suggest_cheap_product',
            actionText: 'Voir suggestions'
        });
        
        // Suggestion 4: Stock limité
        cartItems.forEach(item => {
            if (item.stockQuantity && item.stockQuantity < 5) {
                suggestions.push({
                    type: 'stock',
                    icon: '⚠️',
                    text: `"${item.name}" - Stock limité (${item.stockQuantity} restants)`,
                    action: null,
                    actionText: null
                });
            }
        });
        
        return suggestions.slice(0, 3); // Limiter à 3 suggestions
    }
}

// Initialisation globale
window.smartCart = new SmartCart();
