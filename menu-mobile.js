// Menu Mobile JavaScript - Touch Optimized
class MobileMenuManager {
    constructor() {
        this.cart = [];
        this.favorites = new Set();
        this.activeCategory = 'bundles';
        this.searchQuery = '';
        this.customizationPrice = 0;
        this.pullDistance = 0;
        this.isPulling = false;
        
        this.init();
    }
    
    init() {
        this.loadSavedData();
        this.setupEventListeners();
        this.setupPullToRefresh();
        this.setupSwipeGestures();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
        this.animateItemsOnLoad();
        
        // iOS specific optimizations
        if (this.isIOS()) {
            document.body.classList.add('ios');
        }
    }
    
    setupEventListeners() {
        // Category pills
        document.querySelectorAll('.pill').forEach(pill => {
            pill.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
        
        // Size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectSize(e));
        });
        
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        
        // Customization options
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => this.updateCustomizationPrice());
        });
        
        // Prevent bounce scrolling on iOS
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupPullToRefresh() {
        const content = document.getElementById('menuContent');
        const pullToRefresh = document.getElementById('pullToRefresh');
        let startY = 0;
        
        content.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                this.isPulling = true;
            }
        }, { passive: true });
        
        content.addEventListener('touchmove', (e) => {
            if (!this.isPulling) return;
            
            const currentY = e.touches[0].clientY;
            this.pullDistance = Math.max(0, currentY - startY);
            
            if (this.pullDistance > 0 && window.scrollY === 0) {
                e.preventDefault();
                const progress = Math.min(this.pullDistance / 100, 1);
                
                pullToRefresh.style.transform = `translateY(${this.pullDistance * 0.5}px)`;
                pullToRefresh.classList.add('pulling');
                
                if (this.pullDistance > 80) {
                    pullToRefresh.querySelector('span').textContent = 'Release to refresh';
                    this.hapticFeedback('light');
                }
                
                // Rotate icon based on pull distance
                const icon = pullToRefresh.querySelector('i');
                icon.style.transform = `rotate(${progress * 180}deg)`;
            }
        }, { passive: false });
        
        content.addEventListener('touchend', () => {
            if (this.pullDistance > 80) {
                this.refresh();
            } else {
                pullToRefresh.style.transform = '';
                pullToRefresh.classList.remove('pulling');
            }
            
            this.isPulling = false;
            this.pullDistance = 0;
        });
    }
    
    refresh() {
        const pullToRefresh = document.getElementById('pullToRefresh');
        pullToRefresh.classList.add('refreshing');
        pullToRefresh.querySelector('span').textContent = 'Refreshing...';
        
        this.hapticFeedback('medium');
        
        // Simulate refresh
        setTimeout(() => {
            pullToRefresh.style.transform = '';
            pullToRefresh.classList.remove('pulling', 'refreshing');
            pullToRefresh.querySelector('span').textContent = 'Pull to refresh';
            
            this.showToast('Menu updated', 'success');
        }, 1500);
    }
    
    setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                const categories = ['bundles', 'platters', 'sides', 'desserts', 'box-meal', 'beverages'];
                const currentIndex = categories.indexOf(this.activeCategory);
                
                if (diff > 0 && currentIndex < categories.length - 1) {
                    // Swipe left - next category
                    this.navigateToCategory(categories[currentIndex + 1]);
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right - previous category
                    this.navigateToCategory(categories[currentIndex - 1]);
                }
            }
        };
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
    }
    
    setupSmoothScroll() {
        // Smooth scroll for category navigation
        document.querySelectorAll('.pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                const category = pill.dataset.category;
                this.navigateToCategory(category);
            });
        });
    }
    
    navigateToCategory(category) {
        const section = document.getElementById(category);
        if (!section) return;
        
        // Update active pill
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Scroll to section
        const headerHeight = document.querySelector('.mobile-header').offsetHeight;
        const pillsHeight = document.querySelector('.category-pills').offsetHeight;
        const offset = headerHeight + pillsHeight + 10;
        
        const targetPosition = section.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        this.activeCategory = category;
        
        // Scroll pills to show active
        this.scrollPillIntoView(category);
    }
    
    scrollPillIntoView(category) {
        const pill = document.querySelector(`[data-category="${category}"]`);
        const container = document.querySelector('.pills-container');
        
        if (pill && container) {
            const pillLeft = pill.offsetLeft;
            const pillWidth = pill.offsetWidth;
            const containerWidth = container.parentElement.offsetWidth;
            const scrollLeft = pillLeft - (containerWidth / 2) + (pillWidth / 2);
            
            container.parentElement.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }
    
    setupIntersectionObserver() {
        const sections = document.querySelectorAll('.menu-section');
        const offset = 150;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveCategory(sectionId);
                }
            });
        }, {
            rootMargin: `-${offset}px 0px -50% 0px`
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateActiveCategory(sectionId) {
        if (this.activeCategory !== sectionId) {
            this.activeCategory = sectionId;
            document.querySelectorAll('.pill').forEach(pill => {
                pill.classList.toggle('active', pill.dataset.category === sectionId);
            });
            this.scrollPillIntoView(sectionId);
        }
    }
    
    handleCategoryClick(e) {
        const pill = e.currentTarget;
        const category = pill.dataset.category;
        this.navigateToCategory(category);
        this.hapticFeedback('light');
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
            const description = item.querySelector('.item-desc').textContent.toLowerCase();
            
            if (title.includes(this.searchQuery) || description.includes(this.searchQuery)) {
                item.style.display = 'flex';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide sections
        document.querySelectorAll('.menu-section').forEach(section => {
            const visibleItems = section.querySelectorAll('.menu-item:not([style*="display: none"])');
            section.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    }
    
    selectSize(e) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const container = btn.parentElement;
        const itemCard = btn.closest('.menu-item');
        const priceElement = itemCard.querySelector('.price');
        
        // Update active state
        container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update price
        const newPrice = btn.dataset.price;
        if (newPrice) {
            priceElement.textContent = `$${newPrice}`;
        }
        
        this.hapticFeedback('light');
    }
    
    quickAdd(event, button) {
        event.stopPropagation();
        
        const itemCard = button.closest('.menu-item');
        const itemName = itemCard.querySelector('h3').textContent;
        const price = itemCard.querySelector('.price').textContent;
        const image = itemCard.querySelector('.item-image img').src;
        
        // Check if customizable
        if (itemCard.classList.contains('customizable')) {
            this.openCustomization(event, button);
            return;
        }
        
        // Get selected size if applicable
        let size = null;
        const activeSize = itemCard.querySelector('.size-btn.active');
        if (activeSize) {
            size = activeSize.textContent;
        }
        
        // Get quantity if applicable
        let quantity = 1;
        const qtyValue = itemCard.querySelector('.qty-value');
        if (qtyValue) {
            quantity = parseInt(qtyValue.textContent);
        }
        
        // Create cart item
        const cartItem = {
            id: Date.now(),
            name: itemName,
            price: parseFloat(price.replace('$', '')),
            quantity: quantity,
            size: size,
            image: image
        };
        
        // Add to cart
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartUI();
        
        // Animate button
        button.classList.add('added');
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = '<i class="fas fa-plus"></i>';
        }, 1500);
        
        // Show toast
        this.showToast(`${itemName} added to cart`);
        this.hapticFeedback('medium');
    }
    
    toggleFavorite(event, button) {
        event.stopPropagation();
        
        const itemCard = button.closest('.menu-item');
        const itemName = itemCard.querySelector('h3').textContent;
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('far')) {
            // Add to favorites
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('favorited');
            this.favorites.add(itemName);
            this.showToast(`${itemName} added to favorites`);
        } else {
            // Remove from favorites
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.classList.remove('favorited');
            this.favorites.delete(itemName);
            this.showToast(`${itemName} removed from favorites`);
        }
        
        // Animate
        button.classList.add('haptic');
        setTimeout(() => button.classList.remove('haptic'), 300);
        
        this.saveFavorites();
        this.hapticFeedback('light');
    }
    
    openCustomization(event, button) {
        event.stopPropagation();
        
        const itemCard = button.closest('.menu-item');
        const itemName = itemCard.querySelector('h3').textContent;
        const itemImage = itemCard.querySelector('.item-image img').src;
        
        // Update bottom sheet content
        const sheet = document.getElementById('customizationSheet');
        sheet.querySelector('.product-info h4').textContent = itemName;
        sheet.querySelector('.product-preview img').src = itemImage;
        
        // Show bottom sheet
        sheet.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.hapticFeedback('light');
    }
    
    closeCustomization() {
        const sheet = document.getElementById('customizationSheet');
        sheet.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateCustomizationPrice() {
        let additionalPrice = 0;
        
        // Calculate radio options
        const selectedRadio = document.querySelector('input[name="burger"]:checked');
        if (selectedRadio) {
            const priceText = selectedRadio.parentElement.querySelector('.option-price').textContent;
            additionalPrice += parseFloat(priceText.replace('+$', '') || 0);
        }
        
        // Calculate checkbox options
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const priceText = checkbox.parentElement.querySelector('.option-price').textContent;
            additionalPrice += parseFloat(priceText.replace('+$', '') || 0);
        });
        
        // Update total
        const basePrice = 12.99;
        const totalPrice = basePrice + additionalPrice;
        document.querySelector('.total-price').textContent = `$${totalPrice.toFixed(2)}`;
        
        this.customizationPrice = totalPrice;
    }
    
    addCustomizedItem() {
        const productName = document.querySelector('.product-info h4').textContent;
        
        // Get customizations
        const customizations = [];
        document.querySelectorAll('input:checked').forEach(input => {
            const label = input.parentElement.querySelector('.option-content span').textContent;
            customizations.push(label);
        });
        
        const instructions = document.querySelector('.customize-section textarea').value;
        
        // Create cart item
        const cartItem = {
            id: Date.now(),
            name: productName,
            price: this.customizationPrice,
            quantity: 1,
            customizations: customizations,
            instructions: instructions
        };
        
        // Add to cart
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartUI();
        
        // Close sheet
        this.closeCustomization();
        
        // Show toast
        this.showToast(`Customized ${productName} added to cart`);
        this.hapticFeedback('success');
    }
    
    increaseQty(button) {
        const qtyValue = button.previousElementSibling;
        let currentQty = parseInt(qtyValue.textContent);
        currentQty++;
        qtyValue.textContent = currentQty;
        this.hapticFeedback('light');
    }
    
    decreaseQty(button) {
        const qtyValue = button.nextElementSibling;
        let currentQty = parseInt(qtyValue.textContent);
        if (currentQty > 1) {
            currentQty--;
            qtyValue.textContent = currentQty;
            this.hapticFeedback('light');
        }
    }
    
    updateCartUI() {
        const floatingCart = document.getElementById('floatingCart');
        const cartBadge = floatingCart.querySelector('.cart-badge');
        const cartItems = floatingCart.querySelector('.cart-items');
        const cartTotal = floatingCart.querySelector('.cart-total');
        
        if (this.cart.length > 0) {
            floatingCart.style.display = 'block';
            
            // Calculate totals
            const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartBadge.textContent = itemCount;
            cartItems.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
            cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        } else {
            floatingCart.style.display = 'none';
        }
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        const icon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
        // Update icon based on type
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        
        // Show toast
        toast.classList.add('show');
        
        // Hide after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    
    hapticFeedback(style = 'light') {
        if ('vibrate' in navigator) {
            switch (style) {
                case 'light':
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    navigator.vibrate(20);
                    break;
                case 'success':
                    navigator.vibrate([10, 10, 10]);
                    break;
            }
        }
        
        // iOS haptic feedback
        if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.haptic.postMessage(style);
        }
    }
    
    animateItemsOnLoad() {
        const items = document.querySelectorAll('.menu-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
        });
    }
    
    loadSavedData() {
        // Load cart
        const savedCart = localStorage.getItem('subcater_mobile_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
        
        // Load favorites
        const savedFavorites = localStorage.getItem('subcater_mobile_favorites');
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
        localStorage.setItem('subcater_mobile_cart', JSON.stringify(this.cart));
    }
    
    saveFavorites() {
        localStorage.setItem('subcater_mobile_favorites', JSON.stringify(Array.from(this.favorites)));
    }
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}

// Global functions
function goBack() {
    window.history.back();
}

function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    if (searchContainer.style.display === 'none') {
        searchContainer.style.display = 'block';
        searchInput.focus();
    } else {
        searchContainer.style.display = 'none';
        searchInput.value = '';
        window.mobileMenuManager.searchQuery = '';
        window.mobileMenuManager.filterMenuItems();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchInput.focus();
    window.mobileMenuManager.searchQuery = '';
    window.mobileMenuManager.filterMenuItems();
}

function showInfo() {
    window.mobileMenuManager.showToast('Restaurant info coming soon');
}

function selectItem(item) {
    // Show item details (future implementation)
    window.mobileMenuManager.hapticFeedback('light');
}

function quickAdd(event, button) {
    window.mobileMenuManager.quickAdd(event, button);
}

function toggleFavorite(event, button) {
    window.mobileMenuManager.toggleFavorite(event, button);
}

function openCustomization(event, button) {
    window.mobileMenuManager.openCustomization(event, button);
}

function closeCustomization() {
    window.mobileMenuManager.closeCustomization();
}

function addCustomizedItem() {
    window.mobileMenuManager.addCustomizedItem();
}

function increaseQty(button) {
    window.mobileMenuManager.increaseQty(button);
}

function decreaseQty(button) {
    window.mobileMenuManager.decreaseQty(button);
}

function viewCart() {
    window.mobileMenuManager.showToast('Opening cart...');
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 500);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenuManager = new MobileMenuManager();
    
    // Prevent overscroll on iOS
    document.body.addEventListener('touchmove', (e) => {
        if (document.body.scrollHeight <= window.innerHeight) {
            e.preventDefault();
        }
    }, { passive: false });
});
