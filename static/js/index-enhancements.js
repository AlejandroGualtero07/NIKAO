function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');
    const scrollTrigger = 300; // Show after scrolling 300px
    
    if (!floatingCTA) return;
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollTrigger) {
            floatingCTA.classList.add('show');
        } else {
            floatingCTA.classList.remove('show');
        }
    });
    
    // Initialize cart counter
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('nikaoCart')) || [];
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElement.textContent = itemCount > 0 ? itemCount : '0';
}

function initScrollAnimation() {
    // Seleccionar todos los elementos con la clase fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Crear un observador de intersección
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento es visible
            if (entry.isIntersecting) {
                // Añadir un retraso basado en su índice para crear un efecto escalonado
                const delay = Array.from(fadeElements).indexOf(entry.target) % 4 * 150;
                setTimeout(() => {
                    entry.target.style.animationPlayState = 'running';
                }, delay);
                
                // Dejar de observar el elemento después de que se haya mostrado
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // 10% del elemento debe estar visible
    
    // Observar cada elemento
    fadeElements.forEach((el, index) => {
        el.style.animationPlayState = 'paused'; // Pausar la animación inicialmente
        observer.observe(el);
    });
}

// Initialize homepage features
document.addEventListener('DOMContentLoaded', function() {
    initFloatingCTA();
    initScrollAnimation();
    
    // Reveal animations for feature items
    const featureItems = document.querySelectorAll('.feature-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    testimonialCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(card);
    });
    
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        fadeObserver.observe(item);
    });
    
    document.addEventListener('animationend', function(e) {
        if (e.target.classList.contains('visible')) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
});
