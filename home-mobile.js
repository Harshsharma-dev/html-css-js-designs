// Home Page JavaScript
class HomePageManager {
    constructor() {
        this.currentPromoSlide = 0;
        this.promoSlides = 3;
        this.cart = {
            items: 2,
            total: 31.98
        };
        this.userLocation = {
            address: 'Boston, MA 02134',
            lat: 42.3601,
            lng: -71.0589
        };
        this.favorites = new Set(['sushi-paradise']);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startPromoCarousel();
        this.initializeAnimations();
        this.checkCartStatus();
        this.setupPullToRefresh();
        this.setupServiceWorker();
    }
    
    setupEventListeners() {
        // Location selector
        const locationSelector = document.querySelector('.location-selector');
        if (locationSelector) {
            locationSelector.addEventListener('click', () => this.openLocationModal());
        }
        
        // Service buttons
        document.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleServiceChange(e));
        });
        
        // Search bar
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('focus', () => this.handleSearchFocus());
        }
        
        // Filter button
        const filterBtn = document.querySelector('.filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => this.openFilters());
        }
        
        // Category items
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
        
        // Restaurant cards
        document.querySelectorAll('.restaurant-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleRestaurantClick(e));
        });
        
        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleFavorite(e));
        });
        
        // Add to cart buttons
        document.querySelectorAll('.add-btn, .reorder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });
        
        // Promo indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToPromoSlide(index));
        });
        
        // See all links
        document.querySelectorAll('.see-all').forEach(link => {
            link.addEventListener('click', (e) => this.handleSeeAll(e));
        });
        
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Floating cart
        const cartButton = document.getElementById('cartButton');
        if (cartButton) {
            cartButton.addEventListener('click', () => this.openCart());
        }
        
        // Scroll events for parallax
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            this.handleScroll(currentScroll, lastScroll);
            lastScroll = currentScroll;
        });
    }
    
    handleServiceChange(e) {
        const btn = e.currentTarget;
        
        // Remove active from all
        document.querySelectorAll('.service-btn').forEach(b => b.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        
        // Show appropriate content based on service
        const service = btn.querySelector('span').textContent;
        this.showNotification(`Switched to ${service} mode`, 'info');
        
        // Update content based on service type
        this.updateContentForService(service);
    }
    
    updateContentForService(service) {
        // In a real app, this would filter restaurants and update UI
        console.log(`Loading ${service} options...`);
        
        if (service === 'Catering') {
            // Show catering-specific UI
            document.querySelector('.events-section').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    handleSearchFocus() {
        // In a real app, this would open a search overlay
        console.log('Opening search interface...');
    }
    
    openFilters() {
        this.showNotification('Opening filters...', 'info');
        // In a real app, this would open a filter modal
    }
    
    handleCategoryClick(e) {
        const category = e.currentTarget.querySelector('span').textContent;
        this.showNotification(`Browsing ${category} restaurants`, 'info');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        
        // In a real app, navigate to category page
        setTimeout(() => {
            window.location.href = `category.html?type=${category.toLowerCase()}`;
        }, 500);
    }
    
    handleRestaurantClick(e) {
        // Prevent click if clicking on favorite button
        if (e.target.closest('.favorite-btn')) {
            return;
        }
        
        const card = e.currentTarget;
        const restaurantName = card.querySelector('h3').textContent;
        
        // Add press animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
        
        // Navigate to restaurant page
        setTimeout(() => {
            window.location.href = `restaurant.html?name=${encodeURIComponent(restaurantName)}`;
        }, 300);
    }
    
    toggleFavorite(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const icon = btn.querySelector('i');
        const restaurantCard = btn.closest('.restaurant-card');
        const restaurantName = restaurantCard.querySelector('h3').textContent;
        
        if (icon.classList.contains('far')) {
            // Add to favorites
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('favorited');
            this.favorites.add(restaurantName);
            this.showNotification('Added to favorites', 'success');
        } else {
            // Remove from favorites
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('favorited');
            this.favorites.delete(restaurantName);
            this.showNotification('Removed from favorites', 'info');
        }
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(20);
        }
        
        // Animate heart
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    }
    
    addToCart(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const card = btn.closest('.reorder-card, .popular-card');
        const itemName = card.querySelector('h4').textContent;
        const price = card.querySelector('.reorder-price, .price').textContent;
        
        // Update cart
        this.cart.items += 1;
        this.cart.total += parseFloat(price.replace('$', ''));
        
        // Animate button
        btn.style.transform = 'scale(0.8)';
        btn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            btn.style.transform = '';
            btn.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1000);
        
        // Update cart UI
        this.updateCartUI();
        
        // Show notification
        this.showNotification(`${itemName} added to cart`, 'success');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([20, 10, 20]);
        }
    }
    
    updateCartUI() {
        const cartButton = document.getElementById('cartButton');
        if (this.cart.items > 0) {
            cartButton.style.display = 'flex';
            cartButton.querySelector('.cart-count').textContent = this.cart.items;
            cartButton.querySelector('.cart-total').textContent = `$${this.cart.total.toFixed(2)}`;
            
            // Animate cart button
            cartButton.style.transform = 'scale(1.1)';
            setTimeout(() => {
                cartButton.style.transform = '';
            }, 200);
        } else {
            cartButton.style.display = 'none';
        }
    }
    
    openCart() {
        this.showNotification('Opening cart...', 'info');
        // In a real app, this would open cart page
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 500);
    }
    
    startPromoCarousel() {
        setInterval(() => {
            this.nextPromoSlide();
        }, 5000);
    }
    
    nextPromoSlide() {
        this.currentPromoSlide = (this.currentPromoSlide + 1) % this.promoSlides;
        this.updatePromoSlide();
    }
    
    goToPromoSlide(index) {
        this.currentPromoSlide = index;
        this.updatePromoSlide();
    }
    
    updatePromoSlide() {
        // Update slides
        document.querySelectorAll('.promo-slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentPromoSlide);
        });
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentPromoSlide);
        });
    }
    
    handleSeeAll(e) {
        e.preventDefault();
        const section = e.target.closest('section').className.split('-')[0];
        this.showNotification(`Opening all ${section}...`, 'info');
    }
    
    handleNavigation(e) {
        const item = e.currentTarget;
        if (item.classList.contains('active')) return;
        
        // Remove active from all
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        
        // Add active to clicked
        item.classList.add('active');
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
    
    handleScroll(currentScroll, lastScroll) {
        const header = document.querySelector('.top-header');
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Parallax effect for hero
        const hero = document.querySelector('.hero-section');
        if (hero && currentScroll < 300) {
            hero.style.transform = `translateY(${currentScroll * 0.5}px)`;
        }
    }
    
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}ms`;
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe cards
        document.querySelectorAll('.restaurant-card, .popular-card, .reorder-card').forEach((card, index) => {
            card.dataset.delay = index * 50;
            observer.observe(card);
        });
    }
    
    checkCartStatus() {
        // Check if there are items in cart from previous session
        const savedCart = localStorage.getItem('subcater_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }
    
    setupPullToRefresh() {
        let startY = 0;
        let isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                isPulling = true;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            const currentY = e.touches[0].pageY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > 0 && pullDistance < 150) {
                // Show pull to refresh indicator
                document.body.style.transform = `translateY(${pullDistance / 3}px)`;
            }
        });
        
        document.addEventListener('touchend', () => {
            if (isPulling) {
                document.body.style.transform = '';
                isPulling = false;
                
                // If pulled enough, refresh
                if (document.body.style.transform) {
                    this.refreshContent();
                }
            }
        });
    }
    
    refreshContent() {
        this.showNotification('Refreshing...', 'info');
        
        // Simulate refresh
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    
    setupServiceWorker() {
        // Register service worker for PWA capabilities
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                console.log('Service worker registration failed');
            });
        }
    }
    
    openLocationModal() {
        document.getElementById('locationModal').style.display = 'flex';
        
        // Setup location modal events
        document.querySelector('.current-location-btn').addEventListener('click', () => {
            this.getCurrentLocation();
        });
        
        document.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', (e) => this.selectLocation(e));
        });
    }
    
    getCurrentLocation() {
        if ('geolocation' in navigator) {
            this.showNotification('Getting your location...', 'info');
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation.lat = position.coords.latitude;
                    this.userLocation.lng = position.coords.longitude;
                    
                    // In a real app, reverse geocode to get address
                    this.userLocation.address = 'Current Location';
                    this.updateLocationUI();
                    this.closeLocationModal();
                    
                    this.showNotification('Location updated', 'success');
                },
                (error) => {
                    this.showNotification('Could not get location', 'error');
                }
            );
        }
    }
    
    selectLocation(e) {
        const item = e.currentTarget;
        
        // Remove selected from all
        document.querySelectorAll('.location-item .selected').forEach(icon => {
            icon.style.display = 'none';
        });
        
        // Add selected to clicked
        const selectedIcon = item.querySelector('.fa-check');
        if (selectedIcon) {
            selectedIcon.style.display = 'block';
        }
        
        // Update location
        const address = item.querySelector('.location-address').textContent;
        this.userLocation.address = address;
        this.updateLocationUI();
        
        setTimeout(() => {
            this.closeLocationModal();
        }, 300);
    }
    
    updateLocationUI() {
        document.querySelector('.location-value').textContent = this.userLocation.address;
    }
    
    closeLocationModal() {
        document.getElementById('locationModal').style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: calc(var(--header-height) + var(--safe-top) + 20px);
            left: 50%;
            transform: translateX(-50%);
            background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
            @keyframes slideUp {
                from {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.getElementById('notification-animations')) {
            style.id = 'notification-animations';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global function for closing location modal
function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.homePageManager = new HomePageManager();
    
    // Add touch feedback for all interactive elements
    document.querySelectorAll('button, .clickable, a').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '';
        });
    });
});

// Save cart state before unload
window.addEventListener('beforeunload', () => {
    if (window.homePageManager) {
        localStorage.setItem('subcater_cart', JSON.stringify(window.homePageManager.cart));
    }
});
