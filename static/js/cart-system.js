// Sistema de Carrito de Compras - NIKAO
class ShoppingCart {
    constructor() {
        this.items = [];
        this.deliveryFee = 4000;
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

        // Verificar si el producto ya está en el carrito
        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: this.getProductImage(productId)
            });
        }

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
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                const productName = item.name;
                this.removeFromCart(productId);
                this.showNotification(`${productName} eliminado del carrito`);
            } else {
                item.quantity = newQuantity;
                this.updateCartDisplay();
                this.saveCartToStorage();
            }
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
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, Math.max(0, ${item.quantity - 1}))">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="cart.updateQuantity(${item.id}, parseInt(this.value))" min="0">
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
            this.notificationText.textContent = message;
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
        localStorage.setItem('nikao_cart', JSON.stringify(this.items));
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('nikao_cart');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
                this.updateCartDisplay();
            } catch (e) {
                console.error('Error loading cart from storage:', e);
                this.items = [];
            }
        }
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
});

// Hacer el carrito accesible globalmente
window.cart = window.cart || new ShoppingCart();
