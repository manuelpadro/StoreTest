/**
 * PADROSTORE - VERSIÓN CORREGIDA Y MEJORADA
 */

(function() {
    'use strict';

    // ============================================
    // DATOS DE PRODUCTOS (Centralizados)
    // ============================================
    const PRODUCTS = {
        destacados: [
            { id: 1, name: 'Vino Tinto Cabernet', price: 450, category: 'vinos', icon: 'fa-wine-bottle', destacado: true },
            { id: 2, name: 'Paquete de Pollo 2kg', price: 680, category: 'carnes', icon: 'fa-drumstick-bite', destacado: true },
            { id: 3, name: 'Lomo Ahumado 1kg', price: 520, category: 'carnes', icon: 'fa-bacon', destacado: true },
            { id: 4, name: 'Champán Brut', price: 890, category: 'vinos', icon: 'fa-champagne-glasses', destacado: true }
        ],
        aceites: [
            { id: 5, name: 'Aceite de Oliva Extra Virgen 1L', price: 450, category: 'aceites', icon: 'fa-oil-can' },
            { id: 6, name: 'Aceite de Girasol 1.5L', price: 320, category: 'aceites', icon: 'fa-oil-can' },
            { id: 7, name: 'Vinagre de Vino Tinto 500ml', price: 180, category: 'aceites', icon: 'fa-flask' },
            { id: 8, name: 'Vino Seco para Cocinar 750ml', price: 280, category: 'aceites', icon: 'fa-wine-bottle' }
        ],
        carnes: [
            { id: 9, name: 'Paquete de Pollo (2 kg)', price: 680, category: 'carnes', icon: 'fa-drumstick-bite' },
            { id: 10, name: 'Lomo Ahumado (1 kg)', price: 520, category: 'carnes', icon: 'fa-bacon' },
            { id: 11, name: 'Picadillo de Res (500g)', price: 320, category: 'carnes', icon: 'fa-utensils' },
            { id: 12, name: 'Paquete de Perros (10u)', price: 280, category: 'carnes', icon: 'fa-hotdog' }
        ],
        vinos: [
            { id: 13, name: 'Vino Tinto - Cabernet', price: 450, category: 'vinos', icon: 'fa-wine-bottle' },
            { id: 14, name: 'Vino Tinto - Malbec', price: 480, category: 'vinos', icon: 'fa-wine-bottle' },
            { id: 15, name: 'Vino Blanco', price: 420, category: 'vinos', icon: 'fa-wine-bottle' },
            { id: 16, name: 'Champán Brut', price: 890, category: 'vinos', icon: 'fa-champagne-glasses' }
        ],
        bebidas: [
            { id: 17, name: 'Refresco Cola 1.5L', price: 120, category: 'bebidas', icon: 'fa-coke-bottle' },
            { id: 18, name: 'Refresco Naranja 1.5L', price: 110, category: 'bebidas', icon: 'fa-orange' },
            { id: 19, name: 'Refresco Limón 1.5L', price: 110, category: 'bebidas', icon: 'fa-lemon' }
        ],
        snacks: [
            { id: 20, name: 'Papitas Clásicas 150g', price: 180, category: 'snacks', icon: 'fa-cookie' },
            { id: 21, name: 'Papitas Clásicas 300g', price: 320, category: 'snacks', icon: 'fa-cookie' },
            { id: 22, name: 'Maní Salado 200g', price: 170, category: 'snacks', icon: 'fa-cookie' }
        ],
        abarrotes: [
            { id: 23, name: 'Arroz 1kg', price: 120, category: 'abarrotes', icon: 'fa-box-open' },
            { id: 24, name: 'Arroz 5kg', price: 550, category: 'abarrotes', icon: 'fa-box-open' },
            { id: 25, name: 'Fideos 500g', price: 90, category: 'abarrotes', icon: 'fa-box-open' }
        ]
    };

    // ============================================
    // ESTADO DE LA APLICACIÓN
    // ============================================
    let state = {
        cart: {
            items: [],  // Comienza vacío (0 items)
            total: 0,
            count: 0
        },
        currentFilter: 'todos',
        searchTerm: '',
        darkMode: false
    };

    // ============================================
    // ELEMENTOS DOM
    // ============================================
    const DOM = {
        cartSidebar: document.getElementById('cartSidebar'),
        cartItems: document.getElementById('cartItems'),
        cartTotal: document.getElementById('cartTotal'),
        cartCount: document.getElementById('cartCount'),
        showCartBtn: document.getElementById('showCart'),
        closeCartBtn: document.getElementById('closeCart'),
        checkoutBtn: document.getElementById('checkoutBtn'),
        searchInput: document.getElementById('searchInput'),
        clearSearch: document.getElementById('clearSearch'),
        filterChips: document.querySelectorAll('.chip'),
        productsContainer: document.getElementById('productsContainer'),
        featuredContainer: document.getElementById('featuredProducts'),
        resultsCount: document.getElementById('resultsCount'),
        themeToggle: document.getElementById('themeToggle'),
        deliveryNote: document.getElementById('deliveryNote'),
        scheduleStatus: document.getElementById('scheduleStatus')
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
        console.log('🚀 PadroStore - Versión Corregida');
        loadState();
        renderProducts();
        renderFeatured();
        setupEventListeners();
        checkSchedule();
        updateCartUI();
        setupTheme();
        startScheduleChecker();
    }

    // ============================================
    // PERSISTENCIA DEL ESTADO
    // ============================================
    function loadState() {
        try {
            // Cargar carrito - si no existe, comienza vacío
            const savedCart = localStorage.getItem('padro_cart_v2');
            if (savedCart) {
                state.cart = JSON.parse(savedCart);
            } else {
                // Asegurar que comienza vacío
                state.cart = { items: [], total: 0, count: 0 };
            }
            
            // Cargar preferencia de modo oscuro
            const savedTheme = localStorage.getItem('padro_theme');
            if (savedTheme === 'dark') {
                state.darkMode = true;
                document.body.classList.add('dark-mode');
            }
        } catch (e) {
            console.log('Error cargando estado');
            state.cart = { items: [], total: 0, count: 0 };
        }
    }

    function saveState() {
        try {
            localStorage.setItem('padro_cart_v2', JSON.stringify(state.cart));
            localStorage.setItem('padro_theme', state.darkMode ? 'dark' : 'light');
        } catch (e) {
            console.log('Error guardando estado');
        }
    }

    // ============================================
    // RENDERIZADO DE PRODUCTOS DESTACADOS
    // ============================================
    function renderFeatured() {
        if (!DOM.featuredContainer) return;
        
        const featured = PRODUCTS.destacados;
        let html = '';
        
        featured.forEach(product => {
            html += `
                <div class="featured-card" data-product-id="${product.id}">
                    <div class="featured-icon"><i class="fas ${product.icon}"></i></div>
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <div class="quantity-selector" data-product-id="${product.id}">
                        <button class="qty-btn" data-action="decrease">-</button>
                        <span class="qty-number">1</span>
                        <button class="qty-btn" data-action="increase">+</button>
                    </div>
                    <button class="btn-add-cart" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
            `;
        });
        
        DOM.featuredContainer.innerHTML = html;
        
        // Agregar event listeners a los botones de cantidad y agregar
        attachFeaturedEvents();
    }

    // ============================================
    // RENDERIZADO DE PRODUCTOS (categorías)
    // ============================================
    function renderProducts() {
        if (!DOM.productsContainer) return;
        
        let filteredProducts = [];
        
        // Obtener todos los productos
        const allProducts = [
            ...PRODUCTS.aceites,
            ...PRODUCTS.carnes,
            ...PRODUCTS.vinos,
            ...PRODUCTS.bebidas,
            ...PRODUCTS.snacks,
            ...PRODUCTS.abarrotes
        ];
        
        // Aplicar filtros
        filteredProducts = allProducts.filter(product => {
            const matchesFilter = state.currentFilter === 'todos' || product.category === state.currentFilter;
            const matchesSearch = product.name.toLowerCase().includes(state.searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        
        // Actualizar contador
        if (DOM.resultsCount) {
            DOM.resultsCount.textContent = `Mostrando ${filteredProducts.length} productos`;
        }
        
        // Agrupar por categoría
        const grouped = {};
        filteredProducts.forEach(product => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category].push(product);
        });
        
        // Renderizar
        let html = '';
        
        if (filteredProducts.length === 0) {
            html = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Probá con otra búsqueda o categoría</p>
                </div>
            `;
        } else {
            for (const [category, products] of Object.entries(grouped)) {
                html += `
                    <div class="category-card">
                        <h3 class="category-title">
                            <i class="fas ${getCategoryIcon(category)}"></i> 
                            ${getCategoryName(category)}
                        </h3>
                        <ul class="products-list">
                            ${products.map(product => renderProductItem(product)).join('')}
                        </ul>
                    </div>
                `;
            }
        }
        
        DOM.productsContainer.innerHTML = html;
        
        // Re-attach event listeners
        attachProductEvents();
    }

    function renderProductItem(product) {
        return `
            <li class="product-item" data-product-id="${product.id}">
                <i class="fas ${product.icon}"></i>
                <span class="product-name">${product.name}</span>
                <span class="product-price">$${product.price}</span>
                <div class="quantity-selector" data-product-id="${product.id}">
                    <button class="qty-btn" data-action="decrease">-</button>
                    <span class="qty-number">1</span>
                    <button class="qty-btn" data-action="increase">+</button>
                </div>
                <button class="btn-add-cart-small" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>
                    <i class="fas fa-cart-plus"></i>
                </button>
            </li>
        `;
    }

    // ============================================
    // EVENT LISTENERS PARA PRODUCTOS DESTACADOS
    // ============================================
    function attachFeaturedEvents() {
        // Botones de cantidad en destacados
        document.querySelectorAll('.featured-card .qty-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const selector = this.closest('.quantity-selector');
                const qtySpan = selector.querySelector('.qty-number');
                let qty = parseInt(qtySpan.textContent);
                const action = this.dataset.action;
                
                if (action === 'increase') {
                    qty = Math.min(10, qty + 1);
                } else {
                    qty = Math.max(1, qty - 1);
                }
                
                qtySpan.textContent = qty;
            });
        });
        
        // Botones agregar en destacados
        document.querySelectorAll('.featured-card .btn-add-cart').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    const productData = this.dataset.product;
                    if (!productData) {
                        console.error('No product data found');
                        return;
                    }
                    
                    // Reemplazar &apos; de vuelta a '
                    const fixedData = productData.replace(/&apos;/g, "'");
                    const product = JSON.parse(fixedData);
                    
                    // Obtener cantidad del selector en esta tarjeta
                    const card = this.closest('.featured-card');
                    const qtySpan = card.querySelector('.qty-number');
                    const quantity = parseInt(qtySpan.textContent) || 1;
                    
                    addToCart(product, quantity);
                    
                    // Reset cantidad a 1 después de agregar
                    qtySpan.textContent = '1';
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    showNotification('Error al agregar producto', 'error');
                }
            });
        });
    }

    // ============================================
    // EVENT LISTENERS PARA PRODUCTOS NORMALES
    // ============================================
    function attachProductEvents() {
        // Botones de cantidad en productos normales
        document.querySelectorAll('.product-item .qty-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const selector = this.closest('.quantity-selector');
                const qtySpan = selector.querySelector('.qty-number');
                let qty = parseInt(qtySpan.textContent);
                const action = this.dataset.action;
                
                if (action === 'increase') {
                    qty = Math.min(10, qty + 1);
                } else {
                    qty = Math.max(1, qty - 1);
                }
                
                qtySpan.textContent = qty;
            });
        });
        
        // Botones agregar en productos normales
        document.querySelectorAll('.product-item .btn-add-cart-small').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    const productData = this.dataset.product;
                    if (!productData) {
                        console.error('No product data found');
                        return;
                    }
                    
                    // Reemplazar &apos; de vuelta a '
                    const fixedData = productData.replace(/&apos;/g, "'");
                    const product = JSON.parse(fixedData);
                    
                    // Obtener cantidad del selector en este item
                    const item = this.closest('.product-item');
                    const qtySpan = item.querySelector('.qty-number');
                    const quantity = parseInt(qtySpan.textContent) || 1;
                    
                    addToCart(product, quantity);
                    
                    // Reset cantidad a 1 después de agregar
                    qtySpan.textContent = '1';
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    showNotification('Error al agregar producto', 'error');
                }
            });
        });
    }

    // ============================================
    // UTILIDADES
    // ============================================
    function getCategoryIcon(category) {
        const icons = {
            'aceites': 'fa-oil-can',
            'carnes': 'fa-drumstick-bite',
            'vinos': 'fa-wine-bottle',
            'bebidas': 'fa-coke-bottle',
            'snacks': 'fa-cookie',
            'abarrotes': 'fa-box-open'
        };
        return icons[category] || 'fa-box';
    }

    function getCategoryName(category) {
        const names = {
            'aceites': 'Aceites y Vinagres',
            'carnes': 'Carnes y Embutidos',
            'vinos': 'Vinos y Licores',
            'bebidas': 'Bebidas',
            'snacks': 'Snacks',
            'abarrotes': 'Abarrotes'
        };
        return names[category] || category;
    }

    // ============================================
    // CARRITO DE COMPRAS
    // ============================================
    function addToCart(product, quantity = 1) {
        if (!product || !product.id) {
            console.error('Invalid product:', product);
            return;
        }
        
        // Buscar si el producto ya existe en el carrito por ID
        const existingItemIndex = state.cart.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Si existe, aumentar cantidad
            state.cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Si no existe, agregar nuevo
            state.cart.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        saveState();
        updateCartUI();
        showNotification(`✅ ${quantity} x ${product.name} agregado`, 'success');
        
        // Animación del contador
        if (DOM.cartCount) {
            DOM.cartCount.style.animation = 'pulse 0.3s';
            setTimeout(() => {
                DOM.cartCount.style.animation = '';
            }, 300);
        }
    }

    function updateQuantity(index, change) {
        if (index >= 0 && index < state.cart.items.length) {
            const item = state.cart.items[index];
            const oldQuantity = item.quantity;
            item.quantity += change;
            
            if (item.quantity <= 0) {
                // Eliminar con animación
                removeItemWithAnimation(index, item.name);
            } else {
                showNotification(`📦 ${item.name}: ${oldQuantity} → ${item.quantity}`, 'info');
                saveState();
                updateCartUI();
            }
        }
    }

    function removeItem(index) {
        if (index >= 0 && index < state.cart.items.length) {
            const item = state.cart.items[index];
            state.cart.items.splice(index, 1);
            showNotification(`🗑️ ${item.name} eliminado`, 'info');
            saveState();
            updateCartUI();
        }
    }

    function removeItemWithAnimation(index, itemName) {
        const cartItem = document.querySelector(`.cart-item[data-index="${index}"]`);
        if (cartItem) {
            cartItem.classList.add('removing');
            setTimeout(() => {
                state.cart.items.splice(index, 1);
                showNotification(`🗑️ ${itemName} eliminado`, 'info');
                saveState();
                updateCartUI();
            }, 300);
        } else {
            state.cart.items.splice(index, 1);
            showNotification(`🗑️ ${itemName} eliminado`, 'info');
            saveState();
            updateCartUI();
        }
    }

    function clearCart() {
        if (state.cart.items.length === 0) return;
        
        if (confirm('¿Vaciar todo el carrito?')) {
            state.cart.items = [];
            saveState();
            updateCartUI();
            showNotification('🔄 Carrito vaciado', 'info');
        }
    }

    function updateCartUI() {
        // Actualizar contador
        state.cart.count = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        state.cart.total = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Actualizar DOM
        if (DOM.cartCount) {
            DOM.cartCount.textContent = state.cart.count;
            
            // Clase para cuando está vacío
            if (state.cart.count === 0) {
                DOM.cartCount.classList.add('zero');
            } else {
                DOM.cartCount.classList.remove('zero');
            }
        }
        
        if (DOM.cartTotal) {
            DOM.cartTotal.textContent = `$${state.cart.total}`;
        }
        
        // Actualizar items del carrito
        if (DOM.cartItems) {
            if (state.cart.items.length === 0) {
                DOM.cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Tu carrito está vacío</p>
                        <small>Agregá productos para comenzar</small>
                    </div>
                `;
                if (DOM.checkoutBtn) DOM.checkoutBtn.disabled = true;
                if (DOM.deliveryNote) DOM.deliveryNote.classList.remove('visible');
            } else {
                let html = '';
                state.cart.items.forEach((item, index) => {
                    html += `
                        <div class="cart-item" data-index="${index}">
                            <div class="cart-item-img">
                                <i class="fas ${item.icon || 'fa-box'}"></i>
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">$${item.price} c/u</div>
                                <div class="cart-item-quantity">
                                    <button class="qty-btn-small" onclick="window.updateQuantity(${index}, -1)">-</button>
                                    <span class="qty-number">${item.quantity}</span>
                                    <button class="qty-btn-small" onclick="window.updateQuantity(${index}, 1)">+</button>
                                </div>
                            </div>
                            <button class="btn-remove-from-cart" onclick="window.removeItem(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                });
                
                // Agregar botón para vaciar carrito
                html += `
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="clear-cart-btn" onclick="window.clearCart()">
                            <i class="fas fa-trash-alt"></i> Vaciar carrito
                        </button>
                    </div>
                `;
                
                DOM.cartItems.innerHTML = html;
                if (DOM.checkoutBtn) DOM.checkoutBtn.disabled = false;
                
               // Opciones de entrega - NUEVO
     if (DOM.deliveryNote) {
         DOM.deliveryNote.innerHTML = `
           <div style="display: flex; flex-direction: column; gap: 8px;">
               <div style="display: flex; align-items: center; gap: 10px;">
                  <i class="fas fa-motorcycle" style="color: var(--primary-dark);"></i>
                  <span>🚚 Mensajería a domicilio</span>
                </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-store" style="color: var(--primary-dark);"></i>
                  <span>🏪 Recoger en tienda (23 y 12, Vedado)</span>
                      </div>
                         <small style="color: var(--text-muted); margin-top: 5px;">
                      <i class="fas fa-info-circle"></i> Elegí la opción al finalizar por WhatsApp
                    </small>
                </div>
                   `;
                    DOM.deliveryNote.classList.add('visible');
                 }
            }
        }
    }

    // ============================================
// CHECKOUT POR WHATSAPP CON OPCIONES
// ============================================
function checkout() {
    if (state.cart.items.length === 0) return;
    
    // Crear un selector flotante de opciones
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'delivery-options-modal';
    optionsDiv.innerHTML = `
        <div class="delivery-options-content">
            <h3><i class="fas fa-truck"></i> Elegí cómo recibir</h3>
            <button class="delivery-option-btn" id="optionDelivery">
                <i class="fas fa-motorcycle"></i>
                <div>
                    <strong>Mensajería a domicilio</strong>
                    <small>Te llevamos el pedido</small>
                </div>
            </button>
            <button class="delivery-option-btn" id="optionPickup">
                <i class="fas fa-store"></i>
                <div>
                    <strong>Recoger en tienda</strong>
                    <small>23 y 12, Vedado</small>
                </div>
            </button>
            <button class="delivery-option-cancel" id="cancelOptions">
                Cancelar
            </button>
        </div>
    `;
    
    document.body.appendChild(optionsDiv);
    
    // Mostrar con animación
    setTimeout(() => {
        optionsDiv.classList.add('active');
    }, 10);
    
    // Opción Mensajería
    document.getElementById('optionDelivery').addEventListener('click', () => {
        generateWhatsAppMessage('delivery');
        optionsDiv.remove();
    });
    
    // Opción Recoger en tienda
    document.getElementById('optionPickup').addEventListener('click', () => {
        generateWhatsAppMessage('pickup');
        optionsDiv.remove();
    });
    
    // Cancelar
    document.getElementById('cancelOptions').addEventListener('click', () => {
        optionsDiv.classList.remove('active');
        setTimeout(() => optionsDiv.remove(), 300);
    });
}

// ============================================
// GENERAR MENSAJE DE WHATSAPP
// ============================================
function generateWhatsAppMessage(option) {
    let message = '🛒 *NUEVO PEDIDO - PADROSTORE*\n\n';
    message += '*📦 PRODUCTOS:*\n';
    
    state.cart.items.forEach(item => {
        message += `• ${item.quantity} x ${item.name} - $${item.price * item.quantity}\n`;
    });
    
    message += `\n💰 *TOTAL: $${state.cart.total}*`;
    
    // Agregar opción elegida
    if (option === 'delivery') {
        message += `\n\n🚚 *OPCIÓN ELEGIDA: Mensajería a domicilio*`;
        message += `\n📍 *Dirección:* [COMPLETAR DIRECCIÓN]`;
    } else {
        message += `\n\n🏪 *OPCIÓN ELEGIDA: Recoger en tienda*`;
        message += `\n📍 *Dirección:* 23 y 12, Vedado`;
    }
    
    message += `\n💳 *Pago:* Efectivo/Transferencia`;
    message += `\n\n✅ *Confirmar pedido*`;
    
    const url = `https://wa.me/5358873126?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Opcional: Vaciar carrito después de enviar
    setTimeout(() => {
        if (confirm('¿Vaciar carrito después del pedido?')) {
            clearCart();
        }
    }, 1000);
}

    // ============================================
    // NOTIFICACIONES
    // ============================================
    function showNotification(message, type = 'info') {
        // Remover notificaciones anteriores
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#a8e6cf',
            info: '#7fc9b0',
            error: '#ef4444'
        };
        
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: ${colors[type]};
            color: ${type === 'error' ? 'white' : '#2d6a4f'};
            padding: 1rem 2rem;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideInRight 0.3s;
            font-weight: 500;
            border: 2px solid white;
            font-size: 1rem;
            max-width: 350px;
        `;
        
        notification.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // ============================================
    // EVENT LISTENERS GENERALES
    // ============================================
    function setupEventListeners() {
        // Carrito
        if (DOM.showCartBtn) {
            DOM.showCartBtn.addEventListener('click', () => {
                DOM.cartSidebar.classList.add('active');
            });
        }
        
        if (DOM.closeCartBtn) {
            DOM.closeCartBtn.addEventListener('click', () => {
                DOM.cartSidebar.classList.remove('active');
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.cartSidebar && DOM.cartSidebar.classList.contains('active')) {
                DOM.cartSidebar.classList.remove('active');
            }
        });
        
        if (DOM.checkoutBtn) {
            DOM.checkoutBtn.addEventListener('click', checkout);
        }
        
        // Búsqueda
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', (e) => {
                state.searchTerm = e.target.value;
                if (DOM.clearSearch) {
                    if (state.searchTerm.length > 0) {
                        DOM.clearSearch.classList.add('visible');
                    } else {
                        DOM.clearSearch.classList.remove('visible');
                    }
                }
                renderProducts();
            });
        }
        
        if (DOM.clearSearch) {
            DOM.clearSearch.addEventListener('click', () => {
                DOM.searchInput.value = '';
                state.searchTerm = '';
                DOM.clearSearch.classList.remove('visible');
                renderProducts();
            });
        }
        
        // Filtros
        if (DOM.filterChips) {
            DOM.filterChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    DOM.filterChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    state.currentFilter = chip.dataset.category;
                    renderProducts();
                });
            });
        }
        
        // Modo oscuro
        if (DOM.themeToggle) {
            DOM.themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Cerrar carrito al hacer click fuera
        document.addEventListener('click', (e) => {
            if (DOM.cartSidebar && 
                DOM.cartSidebar.classList.contains('active') && 
                !DOM.cartSidebar.contains(e.target) && 
                DOM.showCartBtn && 
                !DOM.showCartBtn.contains(e.target)) {
                DOM.cartSidebar.classList.remove('active');
            }
        });
    }

    // ============================================
    // HORARIO DE COMPRA
    // ============================================
    function checkSchedule() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours + minutes / 60;
        
        const openTime = 7; // 7:00 AM
        const closeTime = 21; // 9:00 PM
        
        const isOpen = currentTime >= openTime && currentTime < closeTime;
        
        if (DOM.scheduleStatus) {
            if (isOpen) {
                DOM.scheduleStatus.innerHTML = '🟢 Abierto ahora';
                DOM.scheduleStatus.style.background = '#a8e6cf';
                DOM.scheduleStatus.style.color = '#2d6a4f';
            } else {
                DOM.scheduleStatus.innerHTML = '🔴 Cerrado - Volvemos mañana 7:00 AM';
                DOM.scheduleStatus.style.background = '#ef4444';
                DOM.scheduleStatus.style.color = 'white';
            }
        }
        
        return isOpen;
    }

    function startScheduleChecker() {
        checkSchedule();
        setInterval(checkSchedule, 60000); // Verificar cada minuto
    }

    // ============================================
    // MODO OSCURO
    // ============================================
    function setupTheme() {
        // Ya se cargó en loadState
    }

    function toggleTheme() {
        state.darkMode = !state.darkMode;
        document.body.classList.toggle('dark-mode');
        saveState();
        showNotification(state.darkMode ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado', 'info');
    }

    // ============================================
    // EXPONER FUNCIONES GLOBALES
    // ============================================
    window.addToCart = addToCart;
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.clearCart = clearCart;

    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();