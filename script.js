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
// CHECKOUT POR WHATSAPP CON OPCIONES COMPLETAS
// ============================================
function checkout() {
    if (state.cart.items.length === 0) return;
    
    const total = state.cart.total;
    const halfPayment = Math.ceil(total / 2);
    const deliveryCost = a gestionar con operador ; 
    
    // Crear modal de opciones
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'delivery-options-modal';
    optionsDiv.innerHTML = `
        <div class="delivery-options-content">
            <h3><i class="fas fa-truck"></i> Elegí cómo recibir</h3>
            
            <div class="payment-info">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>💰 Pago: Transferencia bancaria</strong>
                    <small> Importe del 50% para confirmar pedido</small>
                </div>
            </div>
            
            <div class="payment-breakdown">
                <div>
                    <span>Subtotal productos:</span>
                    <span>$${total}</span>
                </div>
                <div id="deliveryCostRow" style="display: none;">
                    <span>Costo envío:</span>
                    <span>+$${deliveryCost}</span>
                </div>
                <div id="totalWithDeliveryRow" style="display: none; font-weight: bold;">
                    <span>TOTAL CON ENVÍO:</span>
                    <span class="highlight">$${total + deliveryCost}</span>
                </div>
                <div style="border-top: 1px dashed var(--primary); margin: 10px 0;"></div>
                <div>
                    <span>Seña (50%):</span>
                    <span class="highlight" id="halfAmount">$${halfPayment}</span>
                </div>
                <div>
                    <span>Restante:</span>
                    <span id="remainingAmount">$${total - halfPayment}</span>
                </div>
            </div>
            
            <button class="delivery-option-btn" id="optionDelivery">
                <i class="fas fa-motorcycle"></i>
                <div>
                    <strong>Mensajería a domicilio (+$${deliveryCost})</strong>
                    <small>Te llevamos el pedido a tu casa</small>
                </div>
            </button>
            
            <button class="delivery-option-btn" id="optionPickup">
                <i class="fas fa-store"></i>
                <div>
                    <strong>Recoger en tienda</strong>
                    <small>23 y 12, Vedado (sin costo)</small>
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
        // Mostrar costos de envío
        document.getElementById('deliveryCostRow').style.display = 'flex';
        document.getElementById('totalWithDeliveryRow').style.display = 'flex';
        
        const totalWithDelivery = total + deliveryCost;
        const halfWithDelivery = Math.ceil(totalWithDelivery / 2);
        
        document.getElementById('halfAmount').textContent = `$${halfWithDelivery}`;
        document.getElementById('remainingAmount').textContent = `$${totalWithDelivery - halfWithDelivery}`;
        
        // Preguntar dirección
        askForAddress('delivery', totalWithDelivery, halfWithDelivery);
        optionsDiv.remove();
    });
    
    // Opción Recoger en tienda
    document.getElementById('optionPickup').addEventListener('click', () => {
        askForAddress('pickup', total, halfPayment);
        optionsDiv.remove();
    });
    
    // Cancelar
    document.getElementById('cancelOptions').addEventListener('click', () => {
        optionsDiv.classList.remove('active');
        setTimeout(() => optionsDiv.remove(), 300);
    });
}

// ============================================
// PREGUNTAR DIRECCIÓN (para mensajería)
// ============================================
function askForAddress(option, totalAmount, halfAmount) {
    const addressDiv = document.createElement('div');
    addressDiv.className = 'delivery-options-modal';
    
    const isDelivery = option === 'delivery';
    
    addressDiv.innerHTML = `
        <div class="delivery-options-content">
            <h3><i class="fas fa-map-marker-alt"></i> ${isDelivery ? 'Dirección de entrega' : 'Confirmar pedido'}</h3>
            
            ${isDelivery ? `
                <div class="address-form">
                    <div class="form-group">
                        <label><i class="fas fa-road"></i> Calle:</label>
                        <input type="text" id="street" placeholder="Ej: Calle 23" class="address-input">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label><i class="fas fa-hashtag"></i> Número:</label>
                            <input type="text" id="number" placeholder="456" class="address-input">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-building"></i> Entre calles:</label>
                            <input type="text" id="between" placeholder="M y N" class="address-input">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-home"></i> Detalles (opcional):</label>
                        <input type="text" id="details" placeholder="Ej: Apartamento 3, timbrar a Pérez" class="address-input">
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-phone"></i> Teléfono de contacto:</label>
                        <input type="tel" id="phone" placeholder="Ej: 51234567" class="address-input">
                    </div>
                </div>
            ` : `
                <div class="pickup-confirm">
                    <p><i class="fas fa-store"></i> <strong>Dirección de la tienda:</strong></p>
                    <p>Calle 23 #456 entre M y N, Vedado</p>
                    <p><i class="fas fa-clock"></i> Horario: 7:00 AM - 9:00 PM</p>
                </div>
            `}
            
            <div class="transfer-info">
                <h4><i class="fas fa-university"></i> Datos para transferencia (monto del 50%)</h4>
                <p><strong>Banco:</strong> BANCO METROPOLITANO S.A.</p>
                <p><strong>Cuenta Corriente:</strong> 9205 9598 7920 9162</p>
                <p><strong>Numero a confirmar:</strong> +5358873126</p>
                <p><strong>Titular:</strong> PadroStore</p>
                <p><strong>Monto a transferir:</strong> <span class="highlight">$${halfAmount}</span></p>
            </div>
            
            <div class="confirmation-box">
                <label class="checkbox-label">
                    <input type="checkbox" id="confirmTransfer">
                    <span> Confirmar la transferencia y enviar el comprobante por WhatsApp</span>
                </label>
            </div>
            
            <div class="modal-actions">
                <button class="delivery-option-btn" id="confirmAndSend" disabled>
                    <i class="fab fa-whatsapp"></i> Confirmar y enviar pedido
                </button>
                <button class="delivery-option-cancel" id="backButton">
                    Volver
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(addressDiv);
    
    // Mostrar con animación
    setTimeout(() => {
        addressDiv.classList.add('active');
    }, 10);
    
    // Habilitar botón cuando confirmen
    const confirmCheck = document.getElementById('confirmTransfer');
    const confirmBtn = document.getElementById('confirmAndSend');
    
    if (confirmCheck) {
        confirmCheck.addEventListener('change', function() {
            confirmBtn.disabled = !this.checked;
        });
    }
    
    // Botón confirmar
    confirmBtn.addEventListener('click', () => {
        let address = '';
        let phone = '';
        
        if (isDelivery) {
            const street = document.getElementById('street').value;
            const number = document.getElementById('number').value;
            const between = document.getElementById('between').value;
            const details = document.getElementById('details').value;
            phone = document.getElementById('phone').value;
            
            if (!street || !number || !between || !phone) {
                alert('Por favor completá los campos obligatorios');
                return;
            }
            
            address = `${street} #${number}, entre ${between}`;
            if (details) address += ` (${details})`;
        }
        
        generateWhatsAppMessage(option, totalAmount, halfAmount, address, phone);
        addressDiv.remove();
    });
    
    // Botón volver
    document.getElementById('backButton').addEventListener('click', () => {
        addressDiv.classList.remove('active');
        setTimeout(() => {
            addressDiv.remove();
            checkout(); // Volver al modal anterior
        }, 300);
    });
}

// ============================================
// GENERAR MENSAJE DE WHATSAPP FINAL
// ============================================
function generateWhatsAppMessage(option, totalAmount, halfAmount, address = '', phone = '') {
    let message = '🛒 *NUEVO PEDIDO - PADROSTORE*\n\n';
    message += '*📦 PRODUCTOS:*\n';
    
    state.cart.items.forEach(item => {
        message += `• ${item.quantity} x ${item.name} - $${item.price * item.quantity}\n`;
    });
    
    message += `\n💰 *SUBTOTAL: $${state.cart.total}*`;
    
    if (option === 'delivery') {
        const deliveryCost = totalAmount - state.cart.total;
        message += `\n🚚 *COSTO ENVÍO: +$${deliveryCost}*`;
        message += `\n💵 *TOTAL CON ENVÍO: $${totalAmount}*`;
    } else {
        message += `\n💵 *TOTAL: $${totalAmount}*`;
    }
    
    message += `\n💳 *SEÑA (50%): $${halfAmount}*`;
    
    // Agregar opción elegida y dirección
    if (option === 'delivery') {
        message += `\n\n🚚 *OPCIÓN: Mensajería a domicilio*`;
        message += `\n📍 *DIRECCIÓN:* ${address}`;
        message += `\n📱 *CONTACTO:* ${phone}`;
    } else {
        message += `\n\n🏪 *OPCIÓN: Recoger en tienda*`;
        message += `\n📍 *DIRECCIÓN:* 23 y 12, Vedado`;
    }
    
    // Datos bancarios
    message += `\n\n🏦 *DATOS PARA TRANSFERENCIA (SEÑA):*`;
    message += `\nBanco: BANCO METROPOLITANO S.A.`;
    message += `\nCuenta: 1234 5678 9012 3456`;
    message += `\nTitular: PadroStore`;
    message += `\nMonto: $${halfAmount}`;
    
    // Instrucciones finales
    message += `\n\n📲 *PARA CONFIRMAR EL PEDIDO:*`;
    message += `\n1. Realizá la transferencia por $${halfAmount}`;
    message += `\n2. Tomá captura del comprobante`;
    message += `\n3. Enviá la imagen por este chat`;
    message += `\n4. Escribí: "Ya transferí, mi pedido es para [tu nombre]"`;
    
    message += `\n\n⏳ *RESTANTE A PAGAR:* $${totalAmount - halfAmount} (al recibir)`;
    
    message += `\n\n✅ *Confirmar pedido*`;
    
    const url = `https://wa.me/5358873126?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Opcional: Vaciar carrito
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


