// Admin Restaurants JavaScript
class AdminRestaurants {
    constructor() {
        this.restaurants = [];
        this.filters = {
            status: '',
            cuisine: '',
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRestaurants();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.filterRestaurants();
            });
        }

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.options[e.target.selectedIndex].parentElement.label || 
                                 e.target.value.includes('online') || e.target.value.includes('offline') ? 'status' : 'cuisine';
                this.filters[filterType] = e.target.value;
                this.filterRestaurants();
            });
        });
    }

    filterRestaurants() {
        // In real app, filter data and re-render
        console.log('Filtering restaurants with:', this.filters);
    }

    toggleRestaurantStatus(restaurantId) {
        const card = document.querySelector(`[data-restaurant-id="${restaurantId}"]`)?.closest('.restaurant-card');
        if (!card) return;

        const statusIndicator = card.querySelector('.status-indicator');
        const isOnline = statusIndicator.classList.contains('online');

        if (isOnline) {
            // Confirm before taking offline
            if (confirm('Are you sure you want to take this restaurant offline?')) {
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusIndicator.innerHTML = '<i class="fas fa-circle"></i> Offline';
                card.classList.add('offline');
                this.showToast('Restaurant taken offline', 'warning');
            }
        } else {
            // Bring online
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
            statusIndicator.innerHTML = '<i class="fas fa-circle"></i> Online';
            card.classList.remove('offline');
            this.showToast('Restaurant is now online', 'success');
        }

        // In real app, make API call
        this.updateRestaurantStatus(restaurantId, !isOnline);
    }

    updateRestaurantStatus(restaurantId, isOnline) {
        // API call to update status
        console.log(`Updating restaurant ${restaurantId} status to:`, isOnline ? 'online' : 'offline');
    }

    loadRestaurants() {
        // In real app, fetch from API
        console.log('Loading restaurants...');
    }

    editRestaurant(restaurantId) {
        // Load restaurant data and show modal
        const modal = document.getElementById('editRestaurantModal');
        modal.classList.add('show');
        
        // In real app, populate form with restaurant data
        console.log('Editing restaurant:', restaurantId);
    }

    saveRestaurant() {
        // Collect form data and save
        const formData = new FormData(document.querySelector('.form-grid').closest('form'));
        
        this.showToast('Restaurant updated successfully', 'success');
        this.closeModal('editRestaurantModal');
    }

    viewMenu(restaurantId) {
        this.showToast('Opening menu management...', 'info');
        // In real app, navigate to menu management
        setTimeout(() => {
            window.location.href = `admin-menu.html?restaurant=${restaurantId}`;
        }, 500);
    }

    viewAnalytics(restaurantId) {
        this.showToast('Loading analytics...', 'info');
        // In real app, navigate to analytics
        setTimeout(() => {
            window.location.href = `admin-analytics.html?restaurant=${restaurantId}`;
        }, 500);
    }

    contactRestaurant(restaurantId) {
        // Get restaurant phone number
        const phone = '555-0200'; // In real app, get from data
        
        this.showToast(`Calling ${phone}...`, 'info');
        setTimeout(() => {
            window.open(`tel:${phone}`);
        }, 500);
    }

    exportRestaurants() {
        this.showToast('Exporting restaurant data...', 'info');
        
        // In real app, generate CSV/Excel file
        setTimeout(() => {
            this.showToast('Download started', 'success');
        }, 1000);
    }

    addNewRestaurant() {
        this.showToast('Opening restaurant registration...', 'info');
        // In real app, show add restaurant modal or navigate to registration page
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'warning' ? 'fa-exclamation-circle' : 
                           type === 'danger' ? 'fa-times-circle' : 
                           'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#4CAF50' : 
                               type === 'warning' ? '#FF9800' : 
                               type === 'danger' ? '#F44336' : 
                               '#2196F3'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }
}

// Global functions
function toggleRestaurantStatus(restaurantId) {
    window.adminRestaurants.toggleRestaurantStatus(restaurantId);
}

function editRestaurant(restaurantId) {
    window.adminRestaurants.editRestaurant(restaurantId);
}

function viewMenu(restaurantId) {
    window.adminRestaurants.viewMenu(restaurantId);
}

function viewAnalytics(restaurantId) {
    window.adminRestaurants.viewAnalytics(restaurantId);
}

function contactRestaurant(restaurantId) {
    window.adminRestaurants.contactRestaurant(restaurantId);
}

function exportRestaurants() {
    window.adminRestaurants.exportRestaurants();
}

function addNewRestaurant() {
    window.adminRestaurants.addNewRestaurant();
}

function saveRestaurant() {
    window.adminRestaurants.saveRestaurant();
}

function closeModal(modalId) {
    window.adminRestaurants.closeModal(modalId);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adminRestaurants = new AdminRestaurants();
});
