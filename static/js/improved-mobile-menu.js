/* ================================================
   JAVASCRIPT MEJORADO PARA MENÚ MÓVIL HAMBURGER
   ==============================================/* Función para manejar focus trap en el menú móvil */
function setupFocusTrap() {
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    if (!mobileMenu) return;/

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuClose = document.querySelector('.mobile-menu-close');
    const body = document.body;
    const html = document.documentElement;
    
    // Función para abrir el menú
    function openMenu() {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
        html.classList.add('menu-open');
        
        // Prevenir scroll del body
        body.style.overflow = 'hidden';
        
        // Animación de entrada para los elementos del menú
        const menuItems = mobileMenu.querySelectorAll('li a');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        html.classList.remove('menu-open');
        
        // Restaurar scroll del body
        body.style.overflow = '';
        
        // Resetear animaciones
        const menuItems = mobileMenu.querySelectorAll('li a');
        menuItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }
    
    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    // Cerrar menú con botón X
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }
    
    // Cerrar menú al hacer click en el overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    const menuLinks = mobileMenu?.querySelectorAll('li a');
    if (menuLinks) {
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Pequeño delay para que se vea la transición
                setTimeout(closeMenu, 150);
            });
        });
    }
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Manejar cambios de orientación y redimensionamiento
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Si la pantalla es grande, cerrar menú móvil
            if (window.innerWidth > 992 && mobileMenu?.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
    
    // Prevenir scroll en dispositivos táctiles cuando el menú está abierto
    document.addEventListener('touchmove', function(e) {
        if (html.classList.contains('menu-open')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Asegurar que el menú esté cerrado al cargar la página
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        menuOverlay?.classList.remove('active');
        menuToggle?.classList.remove('active');
        html.classList.remove('menu-open');
        body.style.overflow = '';
    }
});

/* ================================================
   UTILIDADES ADICIONALES PARA MEJOR UX
   ================================================ */

// Función para detectar si es un dispositivo táctil
function isTouchDevice() {
    return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
}

// Función para smooth scroll al navegar
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Función para manejar focus trap en el menú móvil
function setupFocusTrap() {
    const mobileMenu = document.querySelector('#mobile-menu');
    if (!mobileMenu) return;
    
    const focusableElements = mobileMenu.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    mobileMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Inicializar focus trap cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupFocusTrap);
