// placeholder
// CONFIGURATION WHATSAPP
const WHATSAPP_CONFIG = {
    betty: {
        phone: "+243971455335",
        categories: ["vetements", "cosmetiques", "pharmacie"],
        messageHeader: "🛍️ COMMANDE BETTY KABEY SMART\n📍 Kolwezi\n📅 " + new Date().toLocaleDateString('fr-FR') + "\n"
    },
    laurent: {
        phone: "+243822937321",
        categories: ["electronique", "electrique", "automobile"],
        messageHeader: "🛒 COMMANDE LAURENT KABESHA SMART\n📍 Kolwezi\n📅 " + new Date().toLocaleDateString('fr-FR') + "\n"
    }
};

// ROUTING INTELLIGENT PAR CATÉGORIE
function getResponsibleForCategory(category) {
    if (WHATSAPP_CONFIG.betty.categories.includes(category)) {
        return 'betty';
    } else if (WHATSAPP_CONFIG.laurent.categories.includes(category)) {
        return 'laurent';
    }
    return 'betty'; // Par défaut
}

// FORMATAGE MESSAGE PROFESSIONNEL
function formatWhatsAppMessage(orderData) {
    const config = WHATSAPP_CONFIG[orderData.responsible];
    let message = config.messageHeader;
    
    // INFORMATIONS CLIENT
    message += "\n👤 CLIENT\n";
    message += `Nom: ${orderData.client.name}\n`;
    message += `Téléphone: ${orderData.client.phone}\n`;
    message += `Adresse: ${orderData.client.address}\n`;
    
    // DÉTAILS COMMANDE
    message += "\n📦 DÉTAILS DE LA COMMANDE\n";
    message += "=".repeat(30) + "\n";
    
    orderData.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Catégorie: ${item.category}\n`;
        message += `   Variante: ${item.variant || 'Standard'}\n`;
        message += `   Quantité: ${item.quantity}\n`;
        message += `   Prix unitaire: ${formatCurrency(item.price)}\n`;
        message += `   Sous-total: ${formatCurrency(item.price * item.quantity)}\n`;
        
        // INFORMATIONS SPÉCIFIQUES PAR CATÉGORIE
        if (item.specifications) {
            Object.entries(item.specifications).forEach(([key, value]) => {
                message += `   ${key}: ${value}\n`;
            });
        }
        message += "\n";
    });
    
    // LOGISTIQUE
    message += "\n🚚 LOGISTIQUE\n";
    message += `Mode: ${orderData.delivery.mode}\n`;
    message += `Délai: ${orderData.delivery.delay}\n`;
    message += `Frais: ${formatCurrency(orderData.delivery.cost)}\n`;
    
    // FINANCIAL
    message += "\n💰 FINANCIER\n";
    message += `Sous-total: ${formatCurrency(orderData.financial.subtotal)}\n`;
    message += `Livraison: ${formatCurrency(orderData.financial.delivery)}\n`;
    message += `TOTAL: ${formatCurrency(orderData.financial.total)}\n`;
    message += `Mode paiement: ${orderData.payment.method}\n`;
    
    // INSTRUCTIONS
    message += "\n📋 INSTRUCTIONS\n";
    message += "1. Confirmer la disponibilité\n";
    message += "2. Informer le client des délais\n";
    message += "3. Préparer la facture\n";
    message += "4. Organiser la livraison\n";
    
    message += "\nMerci pour votre confiance ! 🙏\n";
    message += "— LB-K SMART Boutique Intelligence —";
    
    return message;
}

// PROCESSUS DE COMMANDE COMPLET
async function processWhatsAppOrder() {
    // VALIDATION DU PANIER
    const cart = getCart();
    if (cart.items.length === 0) {
        showNotification("⚠️ Votre panier est vide", "error");
        return;
    }
    
    // COLLECTE INFOS CLIENT
    const clientInfo = await collectClientInfo();
    if (!clientInfo) return;
    
    // DÉTERMINATION RESPONSABLE
    const mainCategory = cart.items[0].category;
    const responsible = getResponsibleForCategory(mainCategory);
    
    // CALCUL LOGISTIQUE
    const logistics = calculateLogistics(cart.items, cart.deliveryMode);
    
    // PRÉPARATION DES DONNÉES
    const orderData = {
        id: "CMD-" + Date.now(),
        date: new Date().toISOString(),
        responsible: responsible,
        client: clientInfo,
        items: cart.items,
        delivery: {
            mode: cart.deliveryMode,
            delay: logistics.delay,
            cost: logistics.cost
        },
        financial: {
            subtotal: cart.subtotal,
            delivery: logistics.cost,
            total: cart.subtotal + logistics.cost
        },
        payment: {
            method: clientInfo.paymentMethod,
            status: "en attente"
        }
    };
    
    // SAUVEGARDE LOCAL
    saveOrder(orderData);
    
    // GÉNÉRATION ET ENVOI MESSAGE
    const message = formatWhatsAppMessage(orderData);
    const phone = WHATSAPP_CONFIG[responsible].phone;
    
    // ENCODAGE URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    // OUVERTURE WHATSAPP
    window.open(whatsappURL, '_blank');
    
    // VIDER PANIER
    clearCart();
    
    // CONFIRMATION
    showNotification("✅ Commande envoyée sur WhatsApp !", "success");
    
    // SAUVEGARDE BACKUP
    backupOrder(orderData);
}

// COLLECTE INFOS CLIENT
async function collectClientInfo() {
    return new Promise((resolve) => {
        // MODAL DYNAMIQUE
        const modalHTML = `
            <div class="client-modal">
                <h3>📋 INFORMATIONS CLIENT</h3>
                <input type="text" id="clientName" placeholder="Nom complet" required>
                <input type="tel" id="clientPhone" placeholder="+243..." required>
                <textarea id="clientAddress" placeholder="Adresse de livraison" required></textarea>
                <select id="paymentMethod">
                    <option value="mobile_money">Mobile Money</option>
                    <option value="ilicocash">IllicoCash</option>
                    <option value="cash">Espèces à la livraison</option>
                </select>
                <div class="modal-buttons">
                    <button onclick="cancelOrder()">Annuler</button>
                    <button onclick="confirmClientInfo()">Confirmer</button>
                </div>
            </div>
        `;
        
        // AFFICHAGE MODAL
        showModal(modalHTML);
        
        // GESTIONNAIRES D'ÉVÉNEMENTS
        window.confirmClientInfo = () => {
            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const address = document.getElementById('clientAddress').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            
            if (name && phone && address) {
                resolve({ name, phone, address, paymentMethod });
                closeModal();
            } else {
                showNotification("❌ Veuillez remplir tous les champs", "error");
            }
        };
        
        window.cancelOrder = () => {
            resolve(null);
            closeModal();
        };
    });
}

// UTILITAIRES
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'CDF',
        minimumFractionDigits: 0
    });
    return formatter.format(amount);
}

function showNotification(message, type = 'info') {
    // IMPLÉMENTATION DE NOTIFICATION
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// EXPORT POUR USAGE GLOBAL
window.processWhatsAppOrder = processWhatsAppOrder;
window.formatWhatsAppMessage = formatWhatsAppMessage;
