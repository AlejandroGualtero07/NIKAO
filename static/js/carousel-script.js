/**
 * Script para manejar el carrusel mejorado
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrusel si existe en la página
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        initializeCarousel();
    }
    
    // Para compatibilidad con versiones antiguas
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
        initializeHeroCarousel();
    }
});

function initializeCarousel() {
    // Elementos del carrusel
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    
    // No continuar si no hay diapositivas
    if (!slides.length) return;
    
    // Variables de control
    let currentSlide = 0;
    let slideInterval;
    const slideCount = slides.length;
    
    // Configurar las diapositivas inicialmente (establecer en una fila)
    slidesContainer.style.width = `${slideCount * 100}%`;
    slides.forEach(slide => {
        slide.style.minWidth = `${100 / slideCount}%`;
    });
    
    /**
     * Ir a una diapositiva específica
     */
    function goToSlide(index) {
        // Validar el índice
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        // Actualizar la posición del contenedor
        slidesContainer.style.transform = `translateX(-${index * (100 / slideCount)}%)`;
        
        // Actualizar los indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Actualizar el índice actual
        currentSlide = index;
    }
    
    /**
     * Avanzar a la siguiente diapositiva
     */
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    /**
     * Retroceder a la diapositiva anterior
     */
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    /**
     * Iniciar la rotación automática
     */
    function startAutoRotation() {
        slideInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
    }
    
    /**
     * Detener la rotación automática
     */
    function stopAutoRotation() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }
    
    // Configurar los eventos para los botones
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
            restartAutoRotation();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
            restartAutoRotation();
        });
    }
    
    // Configurar eventos para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            goToSlide(index);
            restartAutoRotation();
        });
    });
    
    /**
     * Reiniciar la rotación automática
     */
    function restartAutoRotation() {
        stopAutoRotation();
        startAutoRotation();
    }
    
    // Pausar la rotación al hacer hover sobre el carrusel
    carouselContainer.addEventListener('mouseenter', stopAutoRotation);
    carouselContainer.addEventListener('mouseleave', startAutoRotation);
    
    // Configurar eventos táctiles para dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const difference = touchStartX - touchEndX;
        const threshold = 50; // Umbral mínimo para considerar un swipe
        
        if (Math.abs(difference) < threshold) return;
        
        if (difference > 0) {
            // Swipe hacia la izquierda -> siguiente diapositiva
            nextSlide();
        } else {
            // Swipe hacia la derecha -> diapositiva anterior
            prevSlide();
        }
        
        restartAutoRotation();
    }
    
    // Iniciar con la primera diapositiva
    goToSlide(0);
    
    // Iniciar la rotación automática
    startAutoRotation();
    
    // Precargar imágenes para transiciones más suaves
    const imageUrls = Array.from(slides).map(slide => {
        const img = slide.querySelector('img');
        return img ? img.src : null;
    }).filter(Boolean);
    
    preloadImages(imageUrls);
}

/**
 * Precargar imágenes para transiciones más suaves
 */
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
