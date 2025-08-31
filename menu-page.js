// Menu Page JavaScript
class MenuManager {
    constructor() {
        this.cart = [];
        this.favorites = new Set();
        this.activeCategory = 'bundles';
        this.searchQuery = '';
        this.customizationPrice = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.setupSmoothScrolling();
        this.setupCategoryObserver();
        this.animateItemsOnLoad();
    }
    
    setupEventListeners() {
        // Category navigation
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
        
        // Search functionality
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        
        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleFavorite(e));
        });
        
        // Size selectors
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectSize(e));
        });
        
        // Customization options
        document.querySelectorAll('.option-item input').forEach(input => {
            input.addEventListener('change', () => this.updateCustomizationPrice());
        });
        
        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleCategoryClick(e) {
        const btn = e.currentTarget;
        const category = btn.dataset.category;
        
        // Update active state
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Smooth scroll to section
        const section = document.getElementById(category);
        if (section) {
            const navHeight = document.querySelector('.category-nav').offsetHeight;
            const headerHeight = document.querySelector('.menu-header').offsetHeight;
            const targetPosition = section.offsetTop - navHeight - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Update active category
        this.activeCategory = category;
    }
    
    setupSmoothScrolling() {
        // Intersection Observer for highlighting active category on scroll
        const sections = document.querySelectorAll('.menu-section');
        const navHeight = document.querySelector('.category-nav').offsetHeight;
        
        const observerOptions = {
            rootMargin: `-${navHeight + 100}px 0px -70% 0px`
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveCategory(sectionId);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveCategory(sectionId) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            if (btn.dataset.category === sectionId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.filterMenuItems();
    }
    
    filterMenuItems() {
        const items = document.querySelectorAll('.menu-item');
        let hasResults = false;
        
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.item-description').textContent.toLowerCase();
            
            if (title.includes(this.searchQuery) || description.includes(this.searchQuery)) {
                item.style.display = 'block';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide sections based on results
        document.querySelectorAll('.menu-section').forEach(section => {
            const visibleItems = section.querySelectorAll('.menu-item:not([style*="display: none"])');
            section.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    }
    
    toggleFavorite(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const icon = btn.querySelector('i');
        const itemCard = btn.closest('.menu-item');
        const itemName = itemCard.querySelector('h3').textContent;
        
        if (icon.classList.contains('far')) {
            // Add to favorites
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('favorited');
            this.favorites.add(itemName);
            this.showNotification(`${itemName} added to favorites`, 'success');
        } else {
            // Remove from favorites
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('favorited');
            this.favorites.delete(itemName);
            this.showNotification(`${itemName} removed from favorites`, 'info');
        }
        
        // Animate heart
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
        
        // Save favorites
        this.saveFavorites();
    }
    
    selectSize(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const container = btn.parentElement;
        
        // Update active state
        container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update price based on size
        const itemCard = btn.closest('.menu-item');
        const priceElement = itemCard.querySelector('.price');
        const basePrice = 4.99;
        const sizeMultipliers = { 'S': 1, 'M': 1.5, 'L': 2 };
        const size = btn.textContent;
        const newPrice = basePrice * sizeMultipliers[size];
        
        priceElement.textContent = `$${newPrice.toFixed(2)}`;
    }
    
    addToCart(button) {
        const itemCard = button.closest('.menu-item');
        const itemName = itemCard.querySelector('h3').textContent;
        const price = itemCard.querySelector('.price').textContent;
        const image = itemCard.querySelector('.item-image img').src;
        
        // Create cart item
        const cartItem = {
            id: Date.now(),
            name: itemName,
            price: parseFloat(price.replace('$', '')),
            quantity: 1,
            image: image
        };
        
        // Check for quantity selector
        const qtyValue = itemCard.querySelector('.qty-value');
        if (qtyValue) {
            cartItem.quantity = parseInt(qtyValue.textContent);
        }
        
        // Check for size selection
        const activeSize = itemCard.querySelector('.size-btn.active');
        if (activeSize) {
            cartItem.size = activeSize.textContent;
        }
        
        // Add to cart
        this.cart.push(cartItem);
        
        // Animate button
        button.classList.add('added');
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
        }, 2000);
        
        // Update cart UI
        this.updateCartUI();
        
        // Show notification
        this.showNotification(`${itemName} added to cart`, 'success');
        
        // Save cart
        this.saveCart();
    }
    
    updateCartUI() {
        const floatingCart = document.getElementById('floatingCart');
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('.cart-total');
        
        if (this.cart.length > 0) {
            floatingCart.style.display = 'flex';
            
            // Calculate totals
            const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartCount.textContent = `${itemCount} items`;
            cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
            
            // Animate cart
            floatingCart.style.transform = 'translateX(-50%) scale(1.05)';
            setTimeout(() => {
                floatingCart.style.transform = 'translateX(-50%) scale(1)';
            }, 200);
        } else {
            floatingCart.style.display = 'none';
        }
    }
    
    customizeItem(button) {
        const itemCard = button.closest('.menu-item');
        const itemName = itemCard.querySelector('h3').textContent;
        
        // Show customization modal
        document.getElementById('customizeModal').style.display = 'flex';
        
        // Update modal title
        const modalTitle = document.querySelector('.modal-header h3');
        modalTitle.textContent = `Customize ${itemName}`;
        
        // Reset customization price
        this.customizationPrice = 0;
        this.updateCustomizationPrice();
    }
    
    updateCustomizationPrice() {
        let additionalPrice = 0;
        
        // Calculate radio options
        const selectedRadio = document.querySelector('input[name="burger"]:checked');
        if (selectedRadio) {
            const priceText = selectedRadio.parentElement.querySelector('.option-price').textContent;
            additionalPrice += parseFloat(priceText.replace('+$', ''));
        }
        
        // Calculate checkbox options
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const priceText = checkbox.parentElement.querySelector('.option-price').textContent;
            additionalPrice += parseFloat(priceText.replace('+$', ''));
        });
        
        // Update total
        const basePrice = 12.99;
        const totalPrice = basePrice + additionalPrice;
        document.querySelector('.total-price strong').textContent = `$${totalPrice.toFixed(2)}`;
        
        this.customizationPrice = totalPrice;
    }
    
    increaseQty(button) {
        const qtyValue = button.previousElementSibling;
        let currentQty = parseInt(qtyValue.textContent);
        currentQty++;
        qtyValue.textContent = currentQty;
    }
    
    decreaseQty(button) {
        const qtyValue = button.nextElementSibling;
        let currentQty = parseInt(qtyValue.textContent);
        if (currentQty > 1) {
            currentQty--;
            qtyValue.textContent = currentQty;
        }
    }
    
    handleScroll() {
        const header = document.querySelector('.menu-header');
        const scrollPosition = window.scrollY;
        
        // Add shadow to header on scroll
        if (scrollPosition > 10) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
    }
    
    setupCategoryObserver() {
        // Make category nav sticky behavior smoother
        const categoryNav = document.querySelector('.category-nav');
        const header = document.querySelector('.menu-header');
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    categoryNav.classList.add('is-sticky');
                } else {
                    categoryNav.classList.remove('is-sticky');
                }
            },
            { threshold: 1 }
        );
        
        observer.observe(header);
    }
    
    animateItemsOnLoad() {
        const items = document.querySelectorAll('.menu-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
        });
    }
    
    loadSavedData() {
        // Load cart
        const savedCart = localStorage.getItem('subcater_cart');
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
        this.favorites.forEach(itemName => {
            const item = Array.from(document.querySelectorAll('.menu-item'))
                .find(i => i.querySelector('h3').textContent === itemName);
            
            if (item) {
                const btn = item.querySelector('.favorite-btn');
                const icon = btn.querySelector('i');
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.classList.add('favorited');
            }
        });
    }
    
    saveCart() {
        localStorage.setItem('subcater_cart', JSON.stringify(this.cart));
    }
    
    saveFavorites() {
        localStorage.setItem('subcater_favorites', JSON.stringify(Array.from(this.favorites)));
    }
    
    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? 'var(--success)' : 'var(--info)'};
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
        
        // Add animation
        const style = document.createElement('style');
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
        `;
        
        if (!document.getElementById('notification-style')) {
            style.id = 'notification-style';
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

// Global functions
function goBack() {
    window.history.back();
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('menuSearch');
    
    if (searchBar.style.display === 'none') {
        searchBar.style.display = 'block';
        searchInput.focus();
    } else {
        searchBar.style.display = 'none';
        searchInput.value = '';
        // Reset search
        window.menuManager.searchQuery = '';
        window.menuManager.filterMenuItems();
    }
}

function showRestaurantInfo() {
    window.menuManager.showNotification('Opening restaurant info...', 'info');
}

function addToCart(button) {
    window.menuManager.addToCart(button);
}

function customizeItem(button) {
    window.menuManager.customizeItem(button);
}

function closeCustomizeModal() {
    document.getElementById('customizeModal').style.display = 'none';
}

function addCustomizedItem() {
    const modalTitle = document.querySelector('.modal-header h3');
    const itemName = modalTitle.textContent.replace('Customize ', '');
    
    // Get customization details
    const selectedOptions = [];
    document.querySelectorAll('.option-item input:checked').forEach(input => {
        selectedOptions.push(input.nextElementSibling.textContent);
    });
    
    const specialInstructions = document.querySelector('.customize-section textarea').value;
    
    // Create customized cart item
    const cartItem = {
        id: Date.now(),
        name: itemName,
        price: window.menuManager.customizationPrice,
        quantity: 1,
        customizations: selectedOptions,
        instructions: specialInstructions
    };
    
    window.menuManager.cart.push(cartItem);
    window.menuManager.updateCartUI();
    window.menuManager.saveCart();
    
    // Close modal
    closeCustomizeModal();
    
    // Show notification
    window.menuManager.showNotification(`Customized ${itemName} added to cart`, 'success');
}

function increaseQty(button) {
    window.menuManager.increaseQty(button);
}

function decreaseQty(button) {
    window.menuManager.decreaseQty(button);
}

function viewCart() {
    window.menuManager.showNotification('Opening cart...', 'info');
    // In a real app, navigate to cart page
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 500);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();
});
