/* ================================================
   JAVASCRIPT ESPECÍFICO PARA MENÚ MÓVIL - NIKAO
   ================================================ */

// Estado global para el menú móvil
let mobileMenuOpen = false;

// Inicializar menú móvil cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded');
    initializeMobileMenu();
});

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    const body = document.body;
    
    // Debug
    console.log('Elements found:', {
        menuToggle: !!menuToggle,
        navCenter: !!navCenter,
        body: !!body
    });
    
    if (!menuToggle || !navCenter) {
        console.error('Menu elements not found! Check HTML structure.');
        return;
    }
    
    console.log('Mobile menu elements found, initializing...');
    
    // Crear overlay para cerrar menú
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    // Event listener para el botón hamburger
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger menu clicked!');
        toggleMenu();
    });
    
    // Event listener para el overlay
    overlay.addEventListener('click', function() {
        console.log('Overlay clicked, closing menu');
        closeMenu();
    });
    
    // Event listeners para los enlaces del menú
    const navLinks = navCenter.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Menu link clicked, closing menu');
            closeMenu();
        });
    });
    
    // Cerrar menú con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOpen) {
            console.log('ESC pressed, closing menu');
            closeMenu();
        }
    });
    
    // Cerrar menú al redimensionar pantalla
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenuOpen) {
            console.log('Screen resized, closing menu');
            closeMenu();
        }
    });
    
    // Cerrar menú al cambiar orientación
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (window.innerWidth > 768 && mobileMenuOpen) {
                console.log('Orientation changed, closing menu');
                closeMenu();
            }
        }, 100);
    });
    
    function toggleMenu() {
        if (mobileMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        console.log('Opening mobile menu');
        mobileMenuOpen = true;
        
        menuToggle.classList.add('active');
        navCenter.classList.add('show');
        overlay.classList.add('show');
        body.classList.add('menu-open');
        
        // Prevenir scroll del body
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        
        // Añadir listener para clicks fuera del menú
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    }
    
    function closeMenu() {
        console.log('Closing mobile menu');
        mobileMenuOpen = false;
        
        menuToggle.classList.remove('active');
        navCenter.classList.remove('show');
        overlay.classList.remove('show');
        body.classList.remove('menu-open');
        
        // Restaurar scroll del body
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        
        // Remover event listener
        document.removeEventListener('click', handleOutsideClick);
    }
    
    function handleOutsideClick(e) {
        // Solo cerrar si el click no fue en el menú o en el botón
        if (!navCenter.contains(e.target) && !menuToggle.contains(e.target)) {
            console.log('Click outside menu, closing');
            closeMenu();
        }
    }
    
    console.log('Mobile menu initialized successfully!');
}

// Debug function - remover en producción
function debugMobileMenu() {
    console.log('=== MOBILE MENU DEBUG ===');
    console.log('Menu toggle element:', document.querySelector('.menu-toggle'));
    console.log('Nav center element:', document.querySelector('.nav-center'));
    console.log('Menu is open:', mobileMenuOpen);
    console.log('Window width:', window.innerWidth);
    console.log('========================');
}

// Hacer función disponible globalmente para debug
window.debugMobileMenu = debugMobileMenu;
