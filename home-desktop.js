// Desktop Home Page JavaScript
class DesktopHomeManager {
    constructor() {
        this.cart = {
            items: 0,
            total: 0
        };
        this.favorites = new Set();
        this.activeCategory = 'all';
        this.filters = {
            price: ['$', '$$'],
            deliveryTime: [],
            dietary: []
        };
        this.restaurants = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.initializeAnimations();
        this.setupIntersectionObserver();
    }
    
    setupEventListeners() {
        // Location selector
        document.querySelector('.location-selector').addEventListener('click', () => {
            this.openLocationModal();
        });
        
        // Service tabs
        document.querySelectorAll('.service-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleServiceChange(e));
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        const searchBtn = document.querySelector('.search-btn');
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        searchBtn.addEventListener('click', () => this.performSearch());
        
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryChange(e));
        });
        
        // Filter checkboxes
        document.querySelectorAll('.checkbox-label input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleFilterChange(e));
        });
        
        // Restaurant cards
        document.querySelectorAll('.restaurant-card').forEach(card => {
            this.setupRestaurantCard(card);
        });
        
        // Reorder buttons
        document.querySelectorAll('.reorder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleReorder(e));
        });
        
        // Sort dropdown
        document.querySelector('.sort-select').addEventListener('change', (e) => {
            this.handleSortChange(e);
        });
        
        // Load more button
        document.querySelector('.load-more-btn').addEventListener('click', () => {
            this.loadMoreRestaurants();
        });
        
        // User button
        document.querySelector('.user-btn').addEventListener('click', () => {
            this.toggleUserMenu();
        });
        
        // Cart button
        document.getElementById('desktopCartBtn').addEventListener('click', () => {
            this.openCart();
        });
        
        // Promo cards
        document.querySelectorAll('.promo-card').forEach(card => {
            card.addEventListener('click', () => this.handlePromoClick(card));
        });
    }
    
    setupRestaurantCard(card) {
        // Click handler
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                this.openRestaurant(card);
            }
        });
        
        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(favoriteBtn);
            });
        }
    }
    
    handleServiceChange(e) {
        const tab = e.currentTarget;
        
        // Remove active from all tabs
        document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
        
        // Add active to clicked tab
        tab.classList.add('active');
        
        // Get service type
        const service = tab.textContent.trim();
        
        // Update UI based on service
        this.updateServiceUI(service);
        
        // Show notification
        this.showNotification(`Switched to ${service} mode`, 'info');
    }
    
    updateServiceUI(service) {
        // In a real app, this would update the UI based on service type
        if (service === 'Catering') {
            // Show catering-specific options
            console.log('Showing catering options...');
        } else if (service === 'Pickup') {
            // Hide delivery fees, show pickup times
            document.querySelectorAll('.delivery-fee').forEach(fee => {
                fee.style.display = 'none';
            });
        }
    }
    
    performSearch() {
        const query = document.querySelector('.search-bar input').value.trim();
        if (query) {
            this.showNotification(`Searching for "${query}"...`, 'info');
            
            // In a real app, this would perform actual search
            setTimeout(() => {
                console.log(`Search results for: ${query}`);
            }, 500);
        }
    }
    
    handleCategoryChange(e) {
        const btn = e.currentTarget;
        const category = btn.querySelector('span').textContent.toLowerCase();
        
        // Update active state
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active category
        this.activeCategory = category;
        
        // Filter restaurants
        this.filterRestaurants();
        
        // Smooth scroll to restaurants section
        document.querySelector('.restaurants-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    handleFilterChange(e) {
        const checkbox = e.target;
        const filterGroup = checkbox.closest('.filter-group').querySelector('h4').textContent;
        const value = checkbox.nextElementSibling.textContent.trim();
        
        // Update filters
        if (filterGroup.includes('Price')) {
            this.updatePriceFilter(checkbox, value);
        } else if (filterGroup.includes('Delivery')) {
            this.updateDeliveryFilter(checkbox, value);
        } else if (filterGroup.includes('Dietary')) {
            this.updateDietaryFilter(checkbox, value);
        }
        
        // Apply filters
        this.filterRestaurants();
    }
    
    updatePriceFilter(checkbox, value) {
        const priceLevel = value.match(/\$+/)[0];
        if (checkbox.checked) {
            this.filters.price.push(priceLevel);
        } else {
            this.filters.price = this.filters.price.filter(p => p !== priceLevel);
        }
    }
    
    updateDeliveryFilter(checkbox, value) {
        if (checkbox.checked) {
            this.filters.deliveryTime.push(value);
        } else {
            this.filters.deliveryTime = this.filters.deliveryTime.filter(t => t !== value);
        }
    }
    
    updateDietaryFilter(checkbox, value) {
        if (checkbox.checked) {
            this.filters.dietary.push(value);
        } else {
            this.filters.dietary = this.filters.dietary.filter(d => d !== value);
        }
    }
    
    filterRestaurants() {
        // In a real app, this would filter the restaurant list
        console.log('Applying filters:', this.filters);
        console.log('Active category:', this.activeCategory);
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification('Filters applied', 'success');
        }, 500);
    }
    
    toggleFavorite(btn) {
        const icon = btn.querySelector('i');
        const card = btn.closest('.restaurant-card');
        const restaurantName = card.querySelector('h3').textContent;
        
        if (icon.classList.contains('far')) {
            // Add to favorites
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('favorited');
            this.favorites.add(restaurantName);
            
            // Animate
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
            
            this.showNotification(`${restaurantName} added to favorites`, 'success');
        } else {
            // Remove from favorites
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('favorited');
            this.favorites.delete(restaurantName);
            
            this.showNotification(`${restaurantName} removed from favorites`, 'info');
        }
        
        // Save to localStorage
        this.saveFavorites();
    }
    
    openRestaurant(card) {
        const restaurantName = card.querySelector('h3').textContent;
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
            window.location.href = `restaurant.html?name=${encodeURIComponent(restaurantName)}`;
        }, 200);
    }
    
    handleReorder(e) {
        e.stopPropagation();
        const card = e.target.closest('.reorder-card');
        const itemName = card.querySelector('h4').textContent;
        
        // Add to cart animation
        const btn = e.target;
        btn.textContent = 'Adding...';
        btn.disabled = true;
        
        setTimeout(() => {
            this.cart.items += 1;
            this.cart.total += parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            this.updateCartUI();
            
            btn.textContent = 'Added!';
            setTimeout(() => {
                btn.textContent = 'Reorder';
                btn.disabled = false;
            }, 1000);
            
            this.showNotification(`${itemName} added to cart`, 'success');
        }, 500);
    }
    
    handleSortChange(e) {
        const sortBy = e.target.value;
        this.showNotification(`Sorting by ${sortBy}`, 'info');
        
        // In a real app, this would sort the restaurants
        this.sortRestaurants(sortBy);
    }
    
    sortRestaurants(sortBy) {
        // Simulate sorting
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            console.log(`Restaurants sorted by: ${sortBy}`);
        }, 500);
    }
    
    loadMoreRestaurants() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const btn = document.querySelector('.load-more-btn');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, this would load more restaurants
            console.log('Loading more restaurants...');
            
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
            this.isLoading = false;
            
            this.showNotification('More restaurants loaded', 'success');
        }, 1500);
    }
    
    updateCartUI() {
        const cartBtn = document.getElementById('desktopCartBtn');
        const badge = cartBtn.querySelector('.cart-badge');
        
        if (this.cart.items > 0) {
            badge.style.display = 'block';
            badge.textContent = this.cart.items;
            
            // Animate badge
            badge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                badge.style.transform = '';
            }, 200);
        } else {
            badge.style.display = 'none';
        }
        
        // Save cart state
        localStorage.setItem('subcater_desktop_cart', JSON.stringify(this.cart));
    }
    
    openCart() {
        if (this.cart.items === 0) {
            this.showNotification('Your cart is empty', 'info');
            return;
        }
        
        this.showNotification('Opening cart...', 'info');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 500);
    }
    
    toggleUserMenu() {
        // In a real app, this would show a dropdown menu
        console.log('Toggle user menu');
    }
    
    handlePromoClick(card) {
        const promoTitle = card.querySelector('h3').textContent;
        this.showNotification(`Opening ${promoTitle} promotion`, 'info');
    }
    
    openLocationModal() {
        // In a real app, this would open location selection modal
        this.showNotification('Opening location selector...', 'info');
    }
    
    loadSavedData() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('subcater_desktop_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
        
        // Load favorites
        const savedFavorites = localStorage.getItem('subcater_favorites');
        if (savedFavorites) {
            this.favorites = new Set(JSON.parse(savedFavorites));
            this.updateFavoriteButtons();
        }
    }
    
    updateFavoriteButtons() {
        this.favorites.forEach(restaurantName => {
            const card = Array.from(document.querySelectorAll('.restaurant-card'))
                .find(c => c.querySelector('h3').textContent === restaurantName);
            
            if (card) {
                const btn = card.querySelector('.favorite-btn');
                const icon = btn.querySelector('i');
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.classList.add('favorited');
            }
        });
    }
    
    saveFavorites() {
        localStorage.setItem('subcater_favorites', JSON.stringify(Array.from(this.favorites)));
    }
    
    initializeAnimations() {
        // Add hover effects
        document.querySelectorAll('.restaurant-card, .reorder-card, .promo-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    setupIntersectionObserver() {
        // Lazy load images and animate elements on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Lazy load images
                    const img = entry.target.querySelector('img[data-src]');
                    if (img) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements
        document.querySelectorAll('.restaurant-card, .promo-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    showLoadingState() {
        const grid = document.querySelector('.restaurants-grid');
        grid.style.opacity = '0.5';
        grid.style.pointerEvents = 'none';
    }
    
    hideLoadingState() {
        const grid = document.querySelector('.restaurants-grid');
        grid.style.opacity = '1';
        grid.style.pointerEvents = 'auto';
    }
    
    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: calc(var(--header-height) + 20px);
            right: 20px;
            background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add animations
        if (!document.getElementById('notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                .animate-in {
                    animation: fadeInUp 0.5s ease-out;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.desktopHomeManager = new DesktopHomeManager();
});
