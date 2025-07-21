// Funcionalidad para la plataforma Nikao
document.addEventListener('DOMContentLoaded', function() {
    
    // Menú hamburguesa para móviles
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Sistema de slider mejorado del hero
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    const navPrev = document.querySelector('.nav-prev');
    const navNext = document.querySelector('.nav-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        // Remover clases activas
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Agregar clase activa al slide actual
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Agregar clase prev al slide anterior si existe
        if (index > 0) {
            slides[index - 1].classList.add('prev');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // Event listeners para navegación
    if (navNext) {
        navNext.addEventListener('click', nextSlide);
    }
    
    if (navPrev) {
        navPrev.addEventListener('click', prevSlide);
    }
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-slide cada 4 segundos
    let autoSlideInterval = setInterval(nextSlide, 4000);
    
    // Pausar auto-slide al hacer hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 4000);
        });
    }
    
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Animación del parpadeo del personaje
    const characterEye = document.querySelector('.character-eye');
    if (characterEye) {
        setInterval(function() {
            characterEye.style.animationDuration = Math.random() * 3 + 2 + 's';
        }, 3000);
    }
    
    // Efecto parallax suave para el hero
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const character = document.querySelector('.character-container');
        
        if (hero && character) {
            hero.style.transform = `translateY(${scrollTop * 0.5}px)`;
            character.style.transform = `translateY(${scrollTop * 0.3}px) rotate(${scrollTop * 0.02}deg)`;
        }
    });
    
    // Animación de entrada para las tarjetas de productos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar todas las tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Smooth scroll para los enlaces de navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Efecto de hover para las redes sociales
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(360deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Selector de ubicación dinámico
    const locationSelector = document.querySelector('.location-selector');
    if (locationSelector) {
        locationSelector.addEventListener('click', function() {
            const locations = ['LAURELES', 'ENVIGADO', 'SABANETA', 'BELLO', 'ITAGÜÍ'];
            const currentLocation = this.querySelector('span:last-child').textContent;
            const currentIndex = locations.findIndex(loc => currentLocation.includes(loc));
            const nextIndex = (currentIndex + 1) % locations.length;
            
            this.querySelector('span:last-child').textContent = `Seleccionar sede - ${locations[nextIndex]}`;
            
            // Actualizar también el badge de ubicación
            const locationBadge = document.querySelector('.location-badge span');
            if (locationBadge) {
                locationBadge.textContent = locations[nextIndex];
            }
        });
    }
    
    // Preloader simple
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Funcionalidad del buscador y filtros
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resultCount = document.getElementById('resultCount');
    // Reutilizar la variable productCards ya declarada
    
    let currentFilter = 'all';
    let currentSort = 'popular';
    
    // Función para filtrar productos
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCount = 0;
        const container = document.querySelector('.products-grid');
        
        // Remover mensaje de "sin resultados" si existe
        const existingNoResults = container.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const name = card.getAttribute('data-name');
            const description = card.querySelector('p').textContent.toLowerCase();
            
            // Verificar filtro de categoría
            const matchesCategory = currentFilter === 'all' || category === currentFilter;
            
            // Verificar término de búsqueda en nombre y descripción
            const matchesSearch = searchTerm === '' || 
                                name.includes(searchTerm) || 
                                card.querySelector('h3').textContent.toLowerCase().includes(searchTerm) ||
                                description.includes(searchTerm);
            
            if (matchesCategory && matchesSearch) {
                card.classList.remove('filtering-out');
                card.classList.add('filtering-in');
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.classList.add('filtering-out');
                card.classList.remove('filtering-in');
                setTimeout(() => {
                    if (card.classList.contains('filtering-out')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Mostrar mensaje si no hay resultados
        if (visibleCount === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results';
            noResultsMessage.innerHTML = `
                <div class="icon">🔍</div>
                <h3>No encontramos resultados</h3>
                <p>Intenta con otros términos de búsqueda o revisa nuestras deliciosas categorías disponibles.</p>
            `;
            container.appendChild(noResultsMessage);
        }
        
        // Actualizar contador
        resultCount.textContent = visibleCount;
        
        // Aplicar ordenamiento después de un breve delay
        setTimeout(() => {
            sortProducts();
        }, 350);
    }
    
    // Función para ordenar productos
    function sortProducts() {
        const visibleCards = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        );
        
        const container = document.querySelector('.products-grid');
        
        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name');
            const nameB = b.getAttribute('data-name');
            
            switch (currentSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name':
                    return nameA.localeCompare(nameB);
                case 'popular':
                default:
                    return 0; // Mantener orden original
            }
        });
        
        // Reordenar elementos en el DOM
        visibleCards.forEach(card => {
            container.appendChild(card);
        });
    }
    
    // Event listeners para búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Event listeners para filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase activa al botón seleccionado
            this.classList.add('active');
            
            // Actualizar filtro actual
            currentFilter = this.getAttribute('data-filter');
            
            // Aplicar filtros
            filterProducts();
        });
    });
    
    // Event listener para ordenamiento
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortProducts();
        });
    }
    
    // Event listener para limpiar filtros
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Limpiar búsqueda
            searchInput.value = '';
            
            // Resetear filtro a "Todas"
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="all"]').classList.add('active');
            currentFilter = 'all';
            
            // Resetear ordenamiento
            sortSelect.value = 'popular';
            currentSort = 'popular';
            
            // Aplicar filtros
            filterProducts();
        });
    }
    
    // Inicializar filtros al cargar la página
    filterProducts();
    
    // Animación de entrada para elementos del buscador
    const searchElements = document.querySelectorAll('.search-filter-section > *');
    searchElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
    });
    
    // Keyframes para animación del buscador
    const searchStyle = document.createElement('style');
    searchStyle.textContent = `
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .search-filter-section {
            animation: fadeInUp 0.8s ease-out forwards;
        }
    `;
    document.head.appendChild(searchStyle);
});

// Funciones de utilidad
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimización del scroll con debounce
const debouncedScroll = debounce(function() {
    const scrollTop = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (header) {
        if (scrollTop > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
            header.style.backdropFilter = 'none';
        }
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Efectos simples y elegantes para las tarjetas de productos
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Añadir delay escalonado para la entrada
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover-active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover-active');
        });
    });
    
    // Añadir keyframes para animación de entrada
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardEntrance {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product-card {
            animation: cardEntrance 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
});

// ========== FUNCIONALIDADES MODERNAS AGREGADAS ==========

// Scroll Progress Indicator
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.product-card, .section-header, .filter-buttons');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    
                    // Añadir diferentes tipos de animación
                    if (index % 3 === 0) {
                        entry.target.classList.add('animate-left');
                    } else if (index % 3 === 1) {
                        entry.target.classList.add('animate-right');
                    }
                }, index * 100); // Delay escalonado
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Shopping Cart Functionality (Basic)
let cart = [];

function addToCart(productName, price) {
    const item = {
        name: productName,
        price: price,
        quantity: 1,
        id: Date.now()
    };
    
    cart.push(item);
    updateCartUI();
    showNotification(`${productName} agregado al carrito`, 'success');
}

function updateCartUI() {
    // Aquí puedes implementar la actualización del UI del carrito
    console.log('Carrito actualizado:', cart);
    
    // Ejemplo de actualización de contador en header (si existe)
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = cart.length;
        cartCounter.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #2196F3, #1976D2)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInFromRight 0.3s ease;
        backdrop-filter: blur(10px);
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Enhanced Product Cards Interaction
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const addButton = card.querySelector('.btn-add-cart');
        
        if (addButton) {
            addButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productName = card.querySelector('h3').textContent;
                const priceText = card.querySelector('.product-price').textContent;
                const price = parseInt(priceText.replace(/[^\d]/g, ''));
                
                addToCart(productName, price);
                
                // Efecto visual en el botón
                addButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    addButton.style.transform = '';
                }, 150);
            });
        }
    });
}

// Smooth Scroll Enhancement
function initSmoothScroll() {
    // Smooth scroll para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función para agregar botones a tarjetas que no los tienen
function addMissingProductButtons() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Si la tarjeta no tiene botones de acción, agregarlos
        if (!card.querySelector('.product-actions')) {
            const productName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const price = priceText.replace(/[^\d]/g, '');
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'product-actions';
            actionsDiv.innerHTML = `
                <button class="btn-add-cart">
                    <i class="fas fa-plus"></i>
                    Agregar
                </button>
                <button class="btn-order-now" onclick="window.open('https://wa.me/573042025223?text=Hola! Me interesa ${encodeURIComponent(productName)} por ${priceText}', '_blank')">
                    <i class="fab fa-whatsapp"></i>
                    Pedir
                </button>
            `;
            
            card.appendChild(actionsDiv);
        }
    });
    
    // Reinicializar eventos para los nuevos botones
    initProductCards();
}

// Llamar la función después de que se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Agregar un pequeño delay para asegurar que todo esté cargado
    setTimeout(addMissingProductButtons, 100);
});

// Inicializar todas las funcionalidades modernas
document.addEventListener('DOMContentLoaded', function() {
    updateScrollProgress();
    initBackToTop();
    initScrollAnimations();
    initProductCards();
    initSmoothScroll();
    
    // Añadir estilos para notificaciones
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInFromRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutToRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-content i {
            font-size: 18px;
        }
    `;
    document.head.appendChild(notificationStyles);
});

// Actualizar scroll progress en scroll
window.addEventListener('scroll', updateScrollProgress);

// ========== FIN FUNCIONALIDADES MODERNAS ==========
