// Sistema de Carrito de Compras - NIKAO
class ShoppingCart {
    constructor() {
        this.items = [];
        this.deliveryFee = 2000;
        this.init();
        this.loadCartFromStorage();
    }

    init() {
        // Elementos del DOM
        this.cartModal = document.getElementById('cartModal');
        this.cartButton = document.getElementById('cart-button');
        this.cartClose = document.querySelector('.cart-close');
        this.cartItems = document.getElementById('cart-items');
        this.cartEmpty = document.getElementById('cart-empty');
        this.cartFooter = document.getElementById('cart-footer');
        this.cartCount = document.getElementById('cart-count');
        this.cartSubtotal = document.getElementById('cart-subtotal');
        this.cartTotal = document.getElementById('cart-total');
        this.clearCartBtn = document.getElementById('clear-cart');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.notification = document.getElementById('add-to-cart-notification');
        this.notificationText = document.getElementById('notification-text');

        // Event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botones "Añadir al carrito"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-cart') || e.target.closest('.btn-add-cart')) {
                e.preventDefault();
                const button = e.target.classList.contains('btn-add-cart') ? e.target : e.target.closest('.btn-add-cart');
                this.addToCart(button);
            }
        });

        // Abrir modal del carrito
        if (this.cartButton) {
            this.cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCartModal();
            });
        }

        // Cerrar modal del carrito
        if (this.cartClose) {
            this.cartClose.addEventListener('click', () => {
                this.closeCartModal();
            });
        }

        // Cerrar modal haciendo clic fuera
        if (this.cartModal) {
            this.cartModal.addEventListener('click', (e) => {
                if (e.target === this.cartModal) {
                    this.closeCartModal();
                }
            });
        }

        // Vaciar carrito
        if (this.clearCartBtn) {
            this.clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Proceder al checkout
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }
    }

    addToCart(button) {
        const productId = parseInt(button.getAttribute('data-id'));
        const productName = button.getAttribute('data-name');
        const productPrice = parseInt(button.getAttribute('data-price'));

        console.log('=== AÑADIENDO PRODUCTO ===');
        console.log('ID:', productId, 'Nombre:', productName);
        console.log('Carrito antes de añadir:', this.items);

        // Verificar si el producto ya está en el carrito
        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
            console.log('Producto existente encontrado, nueva cantidad:', existingItem.quantity);
        } else {
            const newItem = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: this.getProductImage(productId)
            };
            this.items.push(newItem);
            console.log('Producto nuevo añadido:', newItem);
        }

        console.log('Carrito después de añadir:', this.items);
        
        this.updateCartDisplay();
        this.saveCartToStorage();
        this.showNotification(`${productName} añadido al carrito`);

        // Efecto visual en el botón
        this.animateAddButton(button);
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartDisplay();
        this.saveCartToStorage();
        
        // Cerrar modal si el carrito queda vacío
        if (this.items.length === 0) {
            setTimeout(() => {
                this.closeCartModal();
            }, 1500); // Esperar un poco para que el usuario vea que está vacío
        }
    }

    updateQuantity(productId, newQuantity) {
        console.log('=== UPDATE QUANTITY ===');
        console.log('ID:', productId, 'Nueva cantidad:', newQuantity);
        console.log('Carrito antes de actualizar:', JSON.stringify(this.items));
        
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const item = this.items[itemIndex];
            console.log('Item encontrado:', item.name, 'Cantidad actual:', item.quantity);
            
            if (newQuantity <= 0) {
                // Eliminar producto completamente
                const productName = item.name;
                this.items.splice(itemIndex, 1); // Eliminar por índice
                
                console.log('Producto eliminado:', productName);
                console.log('Carrito después de eliminar:', JSON.stringify(this.items));
                
                // Guardar inmediatamente
                this.saveCartToStorage();
                this.updateCartDisplay();
                this.showNotification(`${productName} eliminado del carrito`);
                
                // Si el carrito queda vacío, cerrar modal
                if (this.items.length === 0) {
                    setTimeout(() => {
                        this.closeCartModal();
                    }, 1500);
                }
            } else {
                // Actualizar cantidad
                this.items[itemIndex].quantity = newQuantity;
                console.log('Cantidad actualizada a:', newQuantity);
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        } else {
            console.log('Item no encontrado para ID:', productId);
        }
    }

    updateCartDisplay() {
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartTotal();
        this.toggleCartEmpty();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
            this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    renderCartItems() {
        if (!this.cartItems) return;

        this.cartItems.innerHTML = '';

        this.items.forEach(item => {
            const cartItemElement = this.createCartItemElement(item);
            this.cartItems.appendChild(cartItemElement);
        });
    }

    createCartItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${this.formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="cart.updateQuantity(${item.id}, parseInt(this.value)||0)" min="0">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" onclick="cart.removeFromCart(${item.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return itemDiv;
    }

    updateCartTotal() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + (this.items.length > 0 ? this.deliveryFee : 0);

        if (this.cartSubtotal) {
            this.cartSubtotal.textContent = `$${this.formatPrice(subtotal)}`;
        }
        
        if (this.cartTotal) {
            this.cartTotal.textContent = `$${this.formatPrice(total)}`;
        }
    }

    toggleCartEmpty() {
        const isEmpty = this.items.length === 0;
        
        if (this.cartEmpty) {
            this.cartEmpty.style.display = isEmpty ? 'block' : 'none';
        }
        
        if (this.cartFooter) {
            this.cartFooter.style.display = isEmpty ? 'none' : 'block';
        }
    }

    clearCart() {
        if (this.items.length === 0) return;

        this.items = [];
        this.updateCartDisplay();
        this.saveCartToStorage();
        this.showNotification('Carrito vaciado');
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + this.deliveryFee;

        // Crear mensaje para WhatsApp
        let message = '🛒 *PEDIDO NIKAO* 🛒\n\n';
        message += '📋 *Productos:*\n';
        
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio: $${this.formatPrice(item.price * item.quantity)}\n\n`;
        });

        message += `💰 *Subtotal:* $${this.formatPrice(subtotal)}\n`;
        message += `🚚 *Domicilio:* $${this.formatPrice(this.deliveryFee)}\n`;
        message += `💳 *TOTAL:* $${this.formatPrice(total)}\n\n`;
        message += '📍 Por favor indica tu dirección de entrega y método de pago preferido.';

        // Abrir WhatsApp
        const whatsappUrl = `https://wa.me/573042025223?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Cerrar modal
        this.closeCartModal();
    }

    openCartModal() {
        if (this.cartModal) {
            this.cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.updateCartDisplay();
        }
    }

    closeCartModal() {
        if (this.cartModal) {
            this.cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message) {
        if (this.notification && this.notificationText) {
            // Personalización para carrito vacío
            let icon = 'fa-check-circle';
            let msg = message;
            let bg = '#28a745';
            if (message === 'Carrito vaciado' || message === 'Carrito vacío') {
                icon = 'fa-shopping-cart';
                msg = 'Carrito vacío';
                bg = '#13b3c5'; // azul igual que en carta.html
            }
            this.notification.innerHTML = `<div class="notification-content"><i class="fas ${icon}"></i> <span id="notification-text">${msg}</span></div>`;
            this.notification.style.background = bg;
            this.notification.classList.add('show');
            setTimeout(() => {
                this.notification.classList.remove('show');
            }, 3000);
        }
    }

    animateAddButton(button) {
        button.style.transform = 'scale(0.95)';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = '';
        }, 200);
    }

    getProductImage(productId) {
        // Mapear IDs a imágenes específicas o usar una imagen por defecto
        const imageMap = {
            1: '/static/images/imagen arepas ej3.jpeg',
            2: '/static/images/imagen arepas ej4.jpeg',
            3: '/static/images/imagen arepas ej6.jpeg',
            4: '/static/images/imagen arepas ej7.jpeg'
        };
        
        return imageMap[productId] || `/static/images/imagen arepas ej${(productId % 4) + 3}.jpeg`;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    saveCartToStorage() {
        try {
            const cartData = JSON.stringify(this.items);
            localStorage.setItem('nikao_cart', cartData);
            console.log('Carrito guardado en localStorage:', cartData);
        } catch (e) {
            console.error('Error guardando carrito:', e);
        }
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('nikao_cart');
        console.log('Cargando carrito desde localStorage:', saved);
        
        if (saved) {
            try {
                this.items = JSON.parse(saved);
                console.log('Items cargados desde localStorage:', this.items);
                this.updateCartDisplay();
            } catch (e) {
                console.error('Error loading cart from storage:', e);
                this.items = [];
                localStorage.removeItem('nikao_cart');
            }
        } else {
            console.log('No hay carrito guardado en localStorage');
            this.items = [];
        }
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
});

// Hacer el carrito accesible globalmente
window.cart = window.cart || new ShoppingCart();
