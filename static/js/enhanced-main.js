// Mejorado JavaScript para funcionalidad general - Optimizado para móvil

// Estado global para el menú móvil
let mobileMenuOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar preloader
    initPreloader();
    
    // Inicializar menú móvil mejorado
    initMobileMenu();
    
    // Inicializar optimizaciones móviles
    initMobileOptimizations();
    
    // Detección de scroll para animaciones (optimizado para móvil)
    initScrollAnimations();
    
    // Selector de idioma (simulado)
    initLanguageSelector();
    
    // Touch gestures para móvil
    initTouchGestures();
});

// Función mejorada para el menú móvil
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    const body = document.body;
    
    if(!menuToggle || !navCenter) {
        console.log('Menu elements not found:', { menuToggle, navCenter });
        return;
    }
    
    console.log('Mobile menu initialized successfully');
    
    // Crear overlay si no existe
    let overlay = document.querySelector('.menu-overlay');
    if(!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    // Click en el botón del menú
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Menu toggle clicked');
        toggleMobileMenu();
    });
    
    // Click en overlay para cerrar
    overlay.addEventListener('click', function() {
        console.log('Overlay clicked');
        closeMobileMenu();
    });
    
    // Función para alternar el menú
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
        console.log('Toggle menu:', mobileMenuOpen);
        
        if(mobileMenuOpen) {
            menuToggle.classList.add('active');
            navCenter.classList.add('show');
            overlay.classList.add('show');
            body.classList.add('menu-open');
            
            // Añadir listener para ESC
            document.addEventListener('keydown', handleEscKey);
            
            // Añadir listener para clicks fuera del menú
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
            }, 100);
        } else {
            closeMobileMenu();
        }
    }
    
    // Función para cerrar el menú
    function closeMobileMenu() {
        console.log('Closing mobile menu');
        mobileMenuOpen = false;
        menuToggle.classList.remove('active');
        navCenter.classList.remove('show');
        overlay.classList.remove('show');
        body.classList.remove('menu-open');
        
        // Remover event listeners
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscKey);
    }
    
    // Manejar ESC key
    function handleEscKey(e) {
        if(e.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
        }
    }
    
    // Manejar clicks fuera del menú
    function handleOutsideClick(e) {
        if(!navCenter.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    }
    
    // Cerrar el menú al hacer clic en un enlace
    const navLinks = navCenter.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Nav link clicked');
            closeMobileMenu();
        });
    });
    
    // Cerrar el menú al cambiar orientación o redimensionar
    window.addEventListener('resize', function() {
        if(window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Manejar orientationchange para dispositivos móviles
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if(window.innerWidth > 768) {
                closeMobileMenu();
            }
            // Recalcular altura del viewport
            setVhProperty();
        }, 100);
    });
}

// Optimizaciones específicas para móvil
function initMobileOptimizations() {
    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if(isMobile || isTouch) {
        document.body.classList.add('is-mobile');
        
        // Optimizar eventos de scroll en móvil
        let ticking = false;
        
        function updateOnScroll() {
            // Actualizar navbar en scroll
            const header = document.querySelector('.header');
            if(header) {
                if(window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if(!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }, { passive: true });
        
        // Prevenir zoom en iOS en inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('touchstart', function() {
                input.style.fontSize = '16px';
            });
        });
        
        // Optimizar transiciones en móvil
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if(reduceMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
    }
    
    // Manejar viewport height en móvil (problema con barra de navegación)
    function setVhProperty() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVhProperty, 100);
    });
}

// Animaciones de scroll optimizadas para móvil
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if(!fadeElements.length) return;
    
    // Usar Intersection Observer para mejor rendimiento en móvil
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Gestos táctiles para móvil
function initTouchGestures() {
    let startY = 0;
    let isScrolling = false;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if(!startY) return;
        
        const currentY = e.touches[0].clientY;
        const diffY = Math.abs(currentY - startY);
        
        if(diffY > 5) {
            isScrolling = true;
        }
        
        // Si el menú móvil está abierto y se está haciendo scroll, cerrarlo
        if(mobileMenuOpen && isScrolling) {
            const navCenter = document.querySelector('.nav-center');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if(navCenter && menuToggle) {
                menuToggle.classList.remove('active');
                navCenter.classList.remove('show');
                document.body.style.overflow = '';
                mobileMenuOpen = false;
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        startY = 0;
        isScrolling = false;
    }, { passive: true });
}

// Inicializar función del preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) return;
    
    // Función para ocultar el preloader
    const hidePreloader = () => {
        setTimeout(() => {
            preloader.classList.add('hide');
            
            // Eliminar del DOM después de la animación
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 800);
    };
    
    // Si el documento ya está completamente cargado, ocultar el preloader inmediatamente
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        // Si no está cargado, añadir evento para ocultarlo cuando se cargue
        window.addEventListener('load', hidePreloader);
        
        // Fallback: si después de 5 segundos no se ha ocultado, forzar su ocultación
        setTimeout(hidePreloader, 5000);
    }
}

// Selector de idioma (simulado)
function initLanguageSelector() {
    const langSelector = document.querySelector('.language-selector');
    if(langSelector) {
        langSelector.addEventListener('click', function() {
            alert('Cambiador de idioma en desarrollo. Actualmente solo español está disponible.');
        });
    }
}
    
    // Inicializar tooltips si se usan en la página
    initTooltips();
    
    // Inicializar carrusel si existe en la página
    initializeCarousel();
    
    // Inicializar testimoniales si existen
    initializeTestimonials();
});

// Función para inicializar tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            const tooltipEl = document.createElement('div');
            tooltipEl.classList.add('tooltip');
            tooltipEl.textContent = tooltipText;
            
            document.body.appendChild(tooltipEl);
            
            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
            tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2}px`;
            tooltipEl.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipEl = document.querySelector('.tooltip');
            if(tooltipEl) {
                tooltipEl.remove();
            }
        });
    });
}

// Función para inicializar carrusel
function initializeCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    const slidesContainer = carouselContainer.querySelector('.carousel-slides');
    const slides = slidesContainer.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    
    // Configurar indicadores con animación
    if (indicators.length > 0) {
        indicators[0].classList.add('active');
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Detener autoplay temporalmente
                stopAutoplay();
                
                // Animar el indicador con un efecto de pulsación
                indicator.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    indicator.style.transform = '';
                }, 200);
                
                goToSlide(index);
                
                // Reiniciar autoplay después de la interacción
                startAutoplay();
            });
        });
    }
    
    // Configurar botones de navegación con animación
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            // Detener autoplay temporalmente
            stopAutoplay();
            
            // Animar el botón
            animateArrow(prevBtn);
            
            goToSlide(currentSlide - 1);
            
            // Reiniciar autoplay después de la interacción
            startAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Detener autoplay temporalmente
            stopAutoplay();
            
            // Animar el botón
            animateArrow(nextBtn);
            
            goToSlide(currentSlide + 1);
            
            // Reiniciar autoplay después de la interacción
            startAutoplay();
        });
    }
    
    // Función para animar los botones de navegación
    function animateArrow(arrow) {
        arrow.style.transform = 'scale(1.2)';
        setTimeout(() => {
            arrow.style.transform = '';
        }, 200);
    }
    
    // Configurar eventos táctiles para deslizar
    slidesContainer.addEventListener('touchstart', touchStart);
    slidesContainer.addEventListener('touchmove', touchMove);
    slidesContainer.addEventListener('touchend', touchEnd);
    
    // Configurar eventos de ratón para deslizar
    slidesContainer.addEventListener('mousedown', touchStart);
    slidesContainer.addEventListener('mousemove', touchMove);
    slidesContainer.addEventListener('mouseup', touchEnd);
    slidesContainer.addEventListener('mouseleave', touchEnd);
    
    function touchStart(e) {
        stopAutoplay();
        isDragging = true;
        startPos = getPositionX(e);
        slidesContainer.style.transition = 'none';
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        const currentPosition = getPositionX(e);
        const diff = currentPosition - startPos;
        const translateX = -currentSlide * 100 + (diff / slidesContainer.offsetWidth) * 100;
        
        // Limitar el arrastre para que no vaya más allá del primer o último slide
        if (translateX > 0 || translateX < -(slideCount - 1) * 100) return;
        
        slidesContainer.style.transform = `translateX(${translateX}%)`;
    }
    
    function touchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const movedBy = getPositionX(e) - startPos;
        
        // Determinar si el usuario ha deslizado lo suficiente para cambiar de slide
        if (movedBy < -100) {
            goToSlide(currentSlide + 1);
        } else if (movedBy > 100) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(currentSlide);
        }
        
        slidesContainer.style.transition = '';
        startAutoplay();
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // Función para ir a un slide específico con transición suave
    function goToSlide(slideIndex) {
        if (slideIndex < 0) {
            slideIndex = slideCount - 1;
        } else if (slideIndex >= slideCount) {
            slideIndex = 0;
        }
        
        // Aplicar transición suave
        slidesContainer.style.transition = 'transform 0.5s ease-in-out';
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Actualizar indicadores con animación
        if (indicators.length > 0) {
            indicators.forEach(ind => ind.classList.remove('active'));
            indicators[slideIndex].classList.add('active');
        }
        
        // Actualizar slide actual
        currentSlide = slideIndex;
        
        // Resaltar la slide actual
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.opacity = '1';
                slide.style.transform = 'scale(1)';
            } else {
                slide.style.opacity = '0.8';
                slide.style.transform = 'scale(0.95)';
            }
        });
    }
    
    // Configurar autoplay mejorado
    let autoplayInterval;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000); // Cambiar cada 5 segundos
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Iniciar autoplay
    startAutoplay();
    
    // Detener autoplay al interactuar con el carrusel
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
    
    // Agregar navegación por teclado
    document.addEventListener('keydown', (e) => {
        // Solo si el carrusel está visible en el viewport
        const rect = carouselContainer.getBoundingClientRect();
        const isVisible = 
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
            
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                stopAutoplay();
                goToSlide(currentSlide - 1);
                startAutoplay();
            } else if (e.key === 'ArrowRight') {
                stopAutoplay();
                goToSlide(currentSlide + 1);
                startAutoplay();
            }
        }
    });
    
    // Crear indicador de progreso
    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('carousel-progress');
    carouselContainer.appendChild(progressIndicator);
    
    let progressAnimation;
    
    function animateProgress() {
        // Reiniciar animación
        if (progressIndicator.animate) {
            progressAnimation = progressIndicator.animate(
                [
                    { width: '0%' },
                    { width: '100%' }
                ],
                {
                    duration: 5000,
                    easing: 'linear',
                    fill: 'forwards'
                }
            );
        }
    }
    
    // Iniciar animación de progreso
    animateProgress();
    
    // Actualizar la animación de progreso cada vez que cambia de slide
    const originalGoToSlide = goToSlide;
    goToSlide = function(slideIndex) {
        originalGoToSlide(slideIndex);
        if (progressAnimation) {
            progressAnimation.cancel();
        }
        animateProgress();
    };
    
    // Aplicar estilo CSS al indicador de progreso
    const style = document.createElement('style');
    style.textContent = `
        .carousel-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 4px;
            width: 0%;
            background-color: var(--gold);
            z-index: 10;
            opacity: 0.7;
            box-shadow: 0 0 10px rgba(255, 167, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
}
}

// Función para inicializar testimoniales
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-control.prev');
    const nextBtn = document.querySelector('.testimonial-control.next');
    
    if (testimonials.length === 0) return;
    
    let currentTestimonial = 0;
    
    // Mostrar el primer testimonio
    testimonials[0].classList.add('active');
    
    // Función para cambiar testimonios
    function showTestimonial(index) {
        if (index < 0) {
            index = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            index = 0;
        }
        
        testimonials.forEach(t => t.classList.remove('active'));
        testimonials[index].classList.add('active');
        currentTestimonial = index;
    }
    
    // Configurar botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showTestimonial(currentTestimonial - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showTestimonial(currentTestimonial + 1);
        });
    }
    
    // Rotación automática de testimonios
    let autoplayInterval = setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 7000); // Cambiar cada 7 segundos
    
    // Detener rotación al interactuar
    const testimonialContainer = document.querySelector('.testimonials-slider');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                showTestimonial(currentTestimonial + 1);
            }, 7000);
        });
    }
}

// Función para manejar filtrado de productos
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // Actualizar botones de filtro
    filterButtons.forEach(button => {
        if (button.getAttribute('data-category') === category || (category === 'all' && button.getAttribute('data-category') === 'all')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Filtrar productos
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, 100);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'translateY(10px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
}

// Función para añadir al carrito (simulada)
function addToCart(productId, productName, price) {
    // Esta es una función simulada para demostración
    console.log(`Producto añadido: ${productName}, ID: ${productId}, Precio: ${price}`);
    
    // Aquí se podría implementar la lógica real del carrito
    // Por ahora, solo mostramos una notificación
    showNotification(`¡${productName} añadido al carrito!`);
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurar botón de cierre
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}
