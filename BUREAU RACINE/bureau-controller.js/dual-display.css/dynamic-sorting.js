class PharmacieProductTemplate {
    constructor() {
        this.template = this.getTemplate();
    }

    getTemplate() {
        return {
            category: 'pharmacie',
            fields: [
                {
                    name: 'nom',
                    label: 'Nom commercial',
                    type: 'text',
                    required: true,
                    placeholder: 'Ex: Paracétamol 500mg'
                },
                {
                    name: 'dci',
                    label: 'Dénomination Commune Internationale',
                    type: 'text',
                    required: true,
                    placeholder: 'Ex: Paracétamol'
                },
                {
                    name: 'dosage',
                    label: 'Dosage',
                    type: 'select',
                    required: true,
                    options: [
                        '50mg', '100mg', '250mg', '500mg', 
                        '750mg', '1000mg', 'Autre'
                    ]
                },
                {
                    name: 'forme',
                    label: 'Forme galénique',
                    type: 'select',
                    required: true,
                    options: [
                        'Comprimé', 'Gélule', 'Sirop', 'Solution',
                        'Pommade', 'Crème', 'Gel', 'Injectable',
                        'Suppositoire', 'Collyre', 'Autre'
                    ]
                },
                {
                    name: 'composition',
                    label: 'Composition',
                    type: 'textarea',
                    placeholder: 'Liste des principes actifs et excipients'
                },
                {
                    name: 'indications',
                    label: 'Indications thérapeutiques',
                    type: 'textarea',
                    required: true
                },
                {
                    name: 'contre_indications',
                    label: 'Contre-indications',
                    type: 'textarea'
                },
                {
                    name: 'posologie',
                    label: 'Posologie',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Ex: 1 comprimé 3 fois par jour'
                },
                {
                    name: 'prescription',
                    label: 'Type de prescription',
                    type: 'select',
                    options: [
                        'Médicament en vente libre',
                        'Médicament sur ordonnance',
                        'Médicament stupéfiant',
                        'Produit pharmaceutique'
                    ]
                },
                {
                    name: 'laboratoire',
                    label: 'Laboratoire fabricant',
                    type: 'text'
                },
                {
                    name: 'pays_origine',
                    label: 'Pays d\'origine',
                    type: 'text'
                },
                {
                    name: 'numero_lot',
                    label: 'Numéro de lot',
                    type: 'text'
                },
                {
                    name: 'date_peremption',
                    label: 'Date de péremption',
                    type: 'date'
                },
                {
                    name: 'conditionnement',
                    label: 'Conditionnement',
                    type: 'select',
                    options: [
                        'Boîte de 10 comprimés',
                        'Boîte de 20 comprimés',
                        'Flacon de 100ml',
                        'Tube de 30g',
                        'Sachet',
                        'Autre'
                    ]
                },
                {
                    name: 'conservation',
                    label: 'Conditions de conservation',
                    type: 'select',
                    options: [
                        'À température ambiante',
                        'Au réfrigérateur (2-8°C)',
                        'À l\'abri de la lumière',
                        'Au sec',
                        'Conditions spéciales'
                    ]
                },
                {
                    name: 'avertissements',
                    label: 'Avertissements spéciaux',
                    type: 'textarea',
                    placeholder: 'Précautions d\'emploi, effets secondaires'
                },
                {
                    name: 'interactions',
                    label: 'Interactions médicamenteuses',
                    type: 'textarea'
                },
                {
                    name: 'sous_traitement',
                    label: 'Sous traitement médical',
                    type: 'radio',
                    options: [
                        { label: 'Nécessite avis médical', value: 'avis_medical' },
                        { label: 'Autotraitement possible', value: 'autotraitement' }
                    ]
                },
                {
                    name: 'classe_therapeutique',
                    label: 'Classe thérapeutique',
                    type: 'text',
                    placeholder: 'Ex: Antalgique, Antibiotique'
                },
                {
                    name: 'quantite_stock',
                    label: 'Quantité en stock',
                    type: 'number',
                    required: true,
                    min: 0
                },
                {
                    name: 'quantite_commande',
                    label: 'Quantité par commande',
                    type: 'select',
                    options: [
                        '1 unité', 'Boîte complète', '10 unités', 
                        '20 unités', '50 unités', '100 unités'
                    ]
                },
                {
                    name: 'delai_approvisionnement',
                    label: 'Délai d\'approvisionnement',
                    type: 'select',
                    options: [
                        'Immédiat (en stock)',
                        '24-48 heures',
                        '3-5 jours',
                        '1-2 semaines',
                        'Sur commande spéciale'
                    ]
                }
            ],
            validations: {
                date_peremption: (value) => {
                    const today = new Date();
                    const expDate = new Date(value);
                    return expDate > today;
                },
                quantite_stock: (value) => value >= 0
            },
            warnings: [
                'Consultez un médecin ou un pharmacien avant utilisation',
                'Respectez la posologie indiquée',
                'Ne dépassez pas la dose recommandée',
                'Conservez hors de portée des enfants'
            ]
        };
    }

    generateForm() {
        const form = document.createElement('form');
        form.className = 'pharmacie-product-form';
        form.id = 'pharmacieProductForm';
        
        this.template.fields.forEach(field => {
            const fieldElement = this.createFieldElement(field);
            form.appendChild(fieldElement);
        });
        
        // Ajouter les avertissements
        const warningsSection = this.createWarningsSection();
        form.appendChild(warningsSection);
        
        return form;
    }

    createFieldElement(field) {
        const container = document.createElement('div');
        container.className = `form-field ${field.type}-field`;
        
        const label = document.createElement('label');
        label.textContent = field.label;
        if (field.required) {
            label.innerHTML += ' <span class="required">*</span>';
        }
        
        let input;
        switch(field.type) {
            case 'select':
                input = document.createElement('select');
                input.name = field.name;
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    input.appendChild(optionElement);
                });
                break;
                
            case 'textarea':
                input = document.createElement('textarea');
                input.name = field.name;
                input.rows = 3;
                input.placeholder = field.placeholder || '';
                break;
                
            case 'radio':
                input = document.createElement('div');
                input.className = 'radio-group';
                field.options.forEach(opt => {
                    const radioContainer = document.createElement('div');
                    radioContainer.className = 'radio-option';
                    
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = field.name;
                    radio.value = opt.value;
                    radio.id = `${field.name}_${opt.value}`;
                    
                    const radioLabel = document.createElement('label');
                    radioLabel.htmlFor = radio.id;
                    radioLabel.textContent = opt.label;
                    
                    radioContainer.appendChild(radio);
                    radioContainer.appendChild(radioLabel);
                    input.appendChild(radioContainer);
                });
                break;
                
            default:
                input = document.createElement('input');
                input.type = field.type;
                input.name = field.name;
                input.placeholder = field.placeholder || '';
                if (field.min !== undefined) {
                    input.min = field.min;
                }
        }
        
        if (field.required) {
            input.required = true;
        }
        
        container.appendChild(label);
        container.appendChild(input);
        
        return container;
    }

    createWarningsSection() {
        const section = document.createElement('div');
        section.className = 'pharmacie-warnings';
        
        const title = document.createElement('h4');
        title.innerHTML = '⚠️ IMPORTANT - MISE EN GARDE';
        
        const list = document.createElement('ul');
        list.className = 'warnings-list';
        
        this.template.warnings.forEach(warning => {
            const item = document.createElement('li');
            item.textContent = warning;
            list.appendChild(item);
        });
        
        section.appendChild(title);
        section.appendChild(list);
        
        return section;
    }

    validateForm(data) {
        const errors = [];
        
        // Validation des champs requis
        this.template.fields.forEach(field => {
            if (field.required && !data[field.name]) {
                errors.push(`${field.label} est obligatoire`);
            }
        });
        
        // Validation spécifique
        Object.keys(this.template.validations).forEach(key => {
            if (data[key] && !this.template.validations[key](data[key])) {
                errors.push(`Validation échouée pour ${key}`);
            }
        });
        
        // Validation date de péremption
        if (data.date_peremption) {
            const today = new Date();
            const expDate = new Date(data.date_peremption);
            if (expDate <= today) {
                errors.push('Le produit est périmé ou proche de la date de péremption');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    generateWhatsAppMessage(productData) {
        return `
🏥 COMMANDE PRODUIT PHARMACEUTIQUE - LB-K SMART

📋 INFORMATIONS DU PRODUIT:
────────────────────────────
• Nom commercial: ${productData.nom}
• DCI: ${productData.dci}
• Dosage: ${productData.dosage}
• Forme: ${productData.forme}
• Laboratoire: ${productData.laboratoire || 'Non spécifié'}

💊 PRESCRIPTION:
• Type: ${productData.prescription}
• Posologie: ${productData.posologie}
• Indications: ${productData.indications}

⚠️ PRÉCAUTIONS:
${productData.avertissements || 'Aucune précaution particulière'}

📦 COMMANDE:
• Conditionnement: ${productData.conditionnement}
• Quantité: ${productData.quantite_commande}
• Délai: ${productData.delai_approvisionnement}

📝 INFORMATIONS SUPPLÉMENTAIRES:
• Numéro de lot: ${productData.numero_lot || 'Non spécifié'}
• Date de péremption: ${productData.date_peremption || 'Non spécifiée'}
• Conservation: ${productData.conservation}

🔒 MISE EN GARDE:
Ce produit nécessite une utilisation responsable.
Consultez un professionnel de santé avant utilisation.

📍 LB-K SMART - Votre santé, notre priorité
`;
    }

    generateProductCard(productData) {
        const isExpired = this.checkExpiration(productData.date_peremption);
        const stockStatus = productData.quantite_stock > 0 ? '🟢 En stock' : '🟡 Sur commande';
        
        return `
            <div class="product-card pharmacie-card ${isExpired ? 'expired' : ''}">
                <div class="product-badge ${isExpired ? 'expired-badge' : 'pharmacie-badge'}">
                    ${isExpired ? '⚠️ PÉRIMÉ' : '💊 PHARMACIE'}
                </div>
                <div class="product-header">
                    <h3 class="product-name">${productData.nom}</h3>
                    <div class="product-dci">${productData.dci}</div>
                </div>
                <div class="product-details">
                    <div class="detail-row">
                        <span class="detail-label">Dosage:</span>
                        <span class="detail-value">${productData.dosage}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Forme:</span>
                        <span class="detail-value">${productData.forme}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Prescription:</span>
                        <span class="detail-value ${productData.prescription === 'Médicament sur ordonnance' ? 'requires-prescription' : ''}">
                            ${productData.prescription}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Stock:</span>
                        <span class="detail-value stock-value">
                            ${stockStatus} (${productData.quantite_stock} unités)
                        </span>
                    </div>
                </div>
                ${isExpired ? '<div class="expiration-warning">⚠️ Produit périmé</div>' : ''}
                <div class="product-actions">
                    <button class="action-btn order-btn" data-id="${productData.id}">
                        <i>💊</i> Commander
                    </button>
                    <button class="action-btn info-btn" data-id="${productData.id}">
                        <i>🔍</i> Détails
                    </button>
                </div>
            </div>
        `;
    }

    checkExpiration(dateString) {
        if (!dateString) return false;
        const today = new Date();
        const expDate = new Date(dateString);
        return expDate <= today;
    }
}

// Template pour les autres catégories (similaire structure)
