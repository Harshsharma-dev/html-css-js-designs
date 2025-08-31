// Admin Customers JavaScript
class AdminCustomers {
    constructor() {
        this.customers = [];
        this.selectedCustomers = new Set();
        this.filters = {
            status: '',
            orderHistory: '',
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCustomers();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.filterCustomers();
            });
        }

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.value.includes('active') || e.target.value.includes('inactive') || e.target.value.includes('vip') ? 'status' : 'orderHistory';
                this.filters[filterType] = e.target.value;
                this.filterCustomers();
            });
        });

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }
    }

    filterCustomers() {
        // In real app, filter data and re-render
        console.log('Filtering customers with:', this.filters);
    }

    toggleSelectAll(checked) {
        document.querySelectorAll('.customer-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedCustomers.add(checkbox.value);
            } else {
                this.selectedCustomers.clear();
            }
        });
    }

    viewCustomerDetails(customerId) {
        // Load customer data and show modal
        const modal = document.getElementById('customerDetailsModal');
        modal.classList.add('show');
        
        // In real app, fetch and populate customer data
        console.log('Viewing customer:', customerId);
    }

    contactCustomer(contact, type) {
        if (type === 'call') {
            this.showToast(`Calling ${contact}...`, 'info');
            setTimeout(() => {
                window.open(`tel:${contact}`);
            }, 500);
        } else if (type === 'email') {
            this.showToast(`Opening email client...`, 'info');
            setTimeout(() => {
                window.open(`mailto:${contact}`);
            }, 500);
        }
    }

    viewOrderHistory(customerId) {
        this.showToast('Loading order history...', 'info');
        // In real app, navigate to order history
        setTimeout(() => {
            window.location.href = `admin-orders.html?customer=${customerId}`;
        }, 500);
    }

    sendWelcomeOffer(customerId) {
        // Show confirmation dialog
        if (confirm('Send welcome offer to this new customer?')) {
            this.showToast('Welcome offer sent successfully!', 'success');
            
            // In real app, make API call
            console.log('Sending welcome offer to:', customerId);
        }
    }

    sendReactivationOffer(customerId) {
        // Show confirmation dialog
        if (confirm('Send win-back offer to this inactive customer?')) {
            this.showToast('Win-back offer sent successfully!', 'success');
            
            // In real app, make API call
            console.log('Sending reactivation offer to:', customerId);
        }
    }

    sendBroadcast() {
        // Show broadcast modal
        this.showToast('Opening broadcast center...', 'info');
        
        // In real app, show broadcast modal or navigate to broadcast page
        console.log('Opening broadcast interface');
    }

    exportCustomers() {
        this.showToast('Exporting customer data...', 'info');
        
        // In real app, generate CSV/Excel file
        setTimeout(() => {
            this.showToast('Download started', 'success');
        }, 1000);
    }

    saveCustomerNotes() {
        const notes = document.querySelector('.notes-field').value;
        
        if (notes.trim()) {
            this.showToast('Notes saved successfully', 'success');
            
            // In real app, save notes via API
            console.log('Saving notes:', notes);
        }
        
        this.closeModal('customerDetailsModal');
    }

    loadCustomers() {
        // In real app, fetch from API
        console.log('Loading customers...');
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
function viewCustomerDetails(customerId) {
    window.adminCustomers.viewCustomerDetails(customerId);
}

function contactCustomer(contact, type) {
    window.adminCustomers.contactCustomer(contact, type);
}

function viewOrderHistory(customerId) {
    window.adminCustomers.viewOrderHistory(customerId);
}

function sendWelcomeOffer(customerId) {
    window.adminCustomers.sendWelcomeOffer(customerId);
}

function sendReactivationOffer(customerId) {
    window.adminCustomers.sendReactivationOffer(customerId);
}

function sendBroadcast() {
    window.adminCustomers.sendBroadcast();
}

function exportCustomers() {
    window.adminCustomers.exportCustomers();
}

function saveCustomerNotes() {
    window.adminCustomers.saveCustomerNotes();
}

function closeModal(modalId) {
    window.adminCustomers.closeModal(modalId);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adminCustomers = new AdminCustomers();
});
