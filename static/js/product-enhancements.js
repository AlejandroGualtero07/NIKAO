// Mejoras para la página de carta y productos
document.addEventListener('DOMContentLoaded', function() {
    // Animación para las tarjetas de productos
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length > 0) {
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }
    
    // Mejorar interacción con los botones
    const actionButtons = document.querySelectorAll('.btn-add-cart, .btn-order-now');
    
    actionButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Filtrado más suave
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const clearFilters = document.getElementById('clearFilters');
    const resultCount = document.getElementById('resultCount');
    
    function updateProductDisplay() {
        const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const searchText = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;
        
        let visibleProducts = [...productCards].filter(card => {
            const category = card.getAttribute('data-category');
            const productName = card.getAttribute('data-name');
            
            const matchesFilter = filter === 'all' || category === filter;
            const matchesSearch = !searchText || productName.includes(searchText);
            
            return matchesFilter && matchesSearch;
        });
        
        // Ordenar productos
        visibleProducts.sort((a, b) => {
            if (sortBy === 'price-low') {
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            } else if (sortBy === 'price-high') {
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            } else if (sortBy === 'name') {
                return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
            }
            return 0;
        });
        
        // Actualizar contador de resultados
        resultCount.textContent = visibleProducts.length;
        
        // Ocultar todos los productos primero
        productCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Mostrar los productos filtrados con animación
        visibleProducts.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'flex';
                card.style.opacity = 0;
                card.classList.add('fade-in');
            }, index * 50);
        });
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateProductDisplay();
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', updateProductDisplay);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', updateProductDisplay);
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (sortSelect) sortSelect.value = 'popular';
            
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                }
            });
            
            updateProductDisplay();
        });
    }
});
