// JS para menú móvil moderno

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle-modern');
  const mobileMenu = document.getElementById('mobile-menu-modern');
  const overlay = document.querySelector('.mobile-menu-modern-overlay');
  const closeBtn = document.querySelector('.mobile-menu-modern-close');

  // Verificar que existen los elementos
  if (!menuToggle || !mobileMenu || !overlay || !closeBtn) {
    console.log('Algunos elementos del menú no se encontraron');
    return;
  }

  function openMenu() {
    console.log('Abriendo menú móvil');
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Agregar animación al toggle
    menuToggle.classList.add('active');
  }
  
  function closeMenu() {
    console.log('Cerrando menú móvil');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remover animación del toggle
    menuToggle.classList.remove('active');
  }

  // Event listeners
  menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Click en menu toggle');
    openMenu();
  });
  
  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });
  
  overlay.addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
  });

  // Cerrar menú al hacer click en un enlace
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
});
