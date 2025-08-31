// Admin Orders JavaScript
class AdminOrders {
    constructor() {
        this.selectedOrders = new Set();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOrders();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchOrders(e.target.value));
        }

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }

        // Individual checkboxes
        document.querySelectorAll('.order-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.toggleOrderSelection(e.target));
        });
    }

    searchOrders(query) {
        const rows = document.querySelectorAll('.order-row');
        const searchTerm = query.toLowerCase();

        rows.forEach(row => {
            const orderId = row.querySelector('.order-id-cell').textContent.toLowerCase();
            const customer = row.querySelector('.customer-name').textContent.toLowerCase();
            const restaurant = row.cells[3].textContent.toLowerCase();

            if (orderId.includes(searchTerm) || 
                customer.includes(searchTerm) || 
                restaurant.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.order-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedOrders.add(checkbox.value);
            } else {
                this.selectedOrders.clear();
            }
        });
        this.updateBulkActions();
    }

    toggleOrderSelection(checkbox) {
        if (checkbox.checked) {
            this.selectedOrders.add(checkbox.value);
        } else {
            this.selectedOrders.delete(checkbox.value);
        }
        this.updateBulkActions();
    }

    updateBulkActions() {
        // Show/hide bulk action buttons based on selection
        const bulkActionsContainer = document.querySelector('.bulk-actions');
        if (bulkActionsContainer) {
            bulkActionsContainer.style.display = this.selectedOrders.size > 0 ? 'flex' : 'none';
        }
    }

    filterByStatus(status) {
        this.currentFilter = status;
        
        // Update active tab
        document.querySelectorAll('.status-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Filter rows
        const rows = document.querySelectorAll('.order-row');
        rows.forEach(row => {
            const statusPill = row.querySelector('.status-pill');
            const orderStatus = statusPill.textContent.toLowerCase().replace(/\s+/g, '-');
            
            if (status === 'all' || orderStatus === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    loadOrders() {
        // In real app, fetch from API
        console.log('Loading orders...');
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
}

// Global functions
function filterByStatus(status) {
    window.adminOrders.filterByStatus(status);
}

function toggleAdvancedFilters() {
    const filters = document.getElementById('advancedFilters');
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
}

function exportOrders() {
    window.adminOrders.showToast('Exporting orders...', 'info');
    // In real app, generate CSV/Excel file
}

function clearFilters() {
    document.querySelectorAll('.filter-select').forEach(select => select.value = '');
    document.querySelectorAll('.date-input').forEach(input => input.value = '');
    document.querySelectorAll('.amount-input').forEach(input => input.value = '');
    window.adminOrders.showToast('Filters cleared', 'success');
}

function applyFilters() {
    window.adminOrders.showToast('Filters applied', 'success');
    // In real app, apply filters and refresh data
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    window.adminOrders.toggleSelectAll(selectAll.checked);
}

function viewOrderDetails(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    modal.classList.add('show');
}

function callCustomer(phone) {
    window.adminOrders.showToast(`Calling ${phone}...`, 'info');
    setTimeout(() => {
        window.open(`tel:${phone}`);
    }, 500);
}

function assignOrder(orderId) {
    // Reuse assign modal from dashboard
    window.adminOrders.showToast('Opening assignment modal...', 'info');
}

function updateOrderStatus(orderId) {
    window.adminOrders.showToast('Status updated successfully', 'success');
}

function trackRider(riderId) {
    window.adminOrders.showToast('Opening rider location...', 'info');
}

function trackOrder(orderId) {
    window.adminOrders.showToast('Opening order tracking...', 'info');
}

function notifyCustomer(orderId) {
    window.adminOrders.showToast('Customer notified', 'success');
}

function downloadInvoice(orderId) {
    window.adminOrders.showToast('Downloading invoice...', 'info');
}

function requestFeedback(orderId) {
    window.adminOrders.showToast('Feedback request sent', 'success');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function createNewOrder() {
    window.location.href = 'admin-create-order.html';
}

function viewRiderDetails(riderId, riderName) {
    // Sample rider data - in real app, fetch from API
    const riderData = {
        'DRV-101': {
            name: 'John Rider',
            phone: '555-0201',
            totalDeliveries: 1234,
            rating: 4.9,
            zone: 'Downtown Boston',
            status: 'Online',
            todayDeliveries: 12,
            todayDistance: '45 km',
            avgTime: '22 min',
            todayEarnings: '$124',
            recentOrders: [
                { orderId: '#ORD-2455', customer: 'Mike Chen', restaurant: 'Burger Joint', time: '25 min', status: 'Delivered', rating: 5 },
                { orderId: '#ORD-2450', customer: 'Sarah Johnson', restaurant: 'Pizza Palace', time: '18 min', status: 'Delivered', rating: 5 },
                { orderId: '#ORD-2445', customer: 'Emma Wilson', restaurant: 'Sushi Express', time: '30 min', status: 'Delivered', rating: 4 }
            ]
        },
        'DRV-102': {
            name: 'David Smith',
            phone: '555-0202',
            totalDeliveries: 890,
            rating: 4.8,
            zone: 'South Boston',
            status: 'On Delivery',
            todayDeliveries: 8,
            todayDistance: '32 km',
            avgTime: '25 min',
            todayEarnings: '$86',
            recentOrders: [
                { orderId: '#ORD-2454', customer: 'Emma Wilson', restaurant: 'Sushi Express', time: '28 min', status: 'On the Way', rating: '-' },
                { orderId: '#ORD-2448', customer: 'Robert Lee', restaurant: 'Taco Bell', time: '20 min', status: 'Delivered', rating: 5 }
            ]
        },
        'DRV-103': {
            name: 'Alex Kumar',
            phone: '555-0203',
            totalDeliveries: 567,
            rating: 4.7,
            zone: 'East Boston',
            status: 'Offline',
            todayDeliveries: 5,
            todayDistance: '20 km',
            avgTime: '30 min',
            todayEarnings: '$54',
            recentOrders: [
                { orderId: '#ORD-2453', customer: 'Robert Lee', restaurant: 'Taco Bell', time: '35 min', status: 'Delivered', rating: 4 }
            ]
        }
    };

    const rider = riderData[riderId] || {};
    
    // Populate modal
    document.getElementById('riderModalTitle').textContent = `Rider Details - ${rider.name || riderName}`;
    document.getElementById('riderAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rider.name || riderName)}&background=4CAF50&color=fff&size=80`;
    document.getElementById('riderName').textContent = rider.name || riderName;
    document.getElementById('riderId').textContent = `#${riderId}`;
    document.getElementById('riderStatus').textContent = rider.status || 'Unknown';
    document.getElementById('riderPhone').textContent = rider.phone || '-';
    document.getElementById('riderDeliveries').textContent = rider.totalDeliveries || '-';
    document.getElementById('riderRating').innerHTML = rider.rating ? `<i class="fas fa-star text-warning"></i> ${rider.rating}/5.0` : '-';
    document.getElementById('riderZone').textContent = rider.zone || '-';
    
    // Today's stats
    document.getElementById('todayDeliveries').textContent = rider.todayDeliveries || '-';
    document.getElementById('todayDistance').textContent = rider.todayDistance || '-';
    document.getElementById('avgTime').textContent = rider.avgTime || '-';
    document.getElementById('todayEarnings').textContent = rider.todayEarnings || '-';
    
    // Recent orders
    const ordersTable = document.getElementById('riderOrdersTable');
    ordersTable.innerHTML = '';
    
    if (rider.recentOrders && rider.recentOrders.length > 0) {
        rider.recentOrders.forEach(order => {
            const row = ordersTable.insertRow();
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.customer}</td>
                <td>${order.restaurant}</td>
                <td>${order.time}</td>
                <td><span class="status-pill ${order.status.toLowerCase().replace(/\s/g, '-')}">${order.status}</span></td>
                <td>${order.rating !== '-' ? `<i class="fas fa-star text-warning"></i> ${order.rating}` : '-'}</td>
            `;
        });
    }
    
    // Update status color
    const statusElement = document.querySelector('.rider-status');
    statusElement.className = 'rider-status';
    if (rider.status === 'Online') {
        statusElement.classList.add('online');
    } else if (rider.status === 'Offline') {
        statusElement.style.backgroundColor = 'rgba(158, 158, 158, 0.1)';
        statusElement.style.color = '#9E9E9E';
    } else if (rider.status === 'On Delivery') {
        statusElement.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
        statusElement.style.color = '#FF9800';
    }
    
    // Store current rider info for actions
    window.currentRiderId = riderId;
    window.currentRiderPhone = rider.phone;
    
    // Show modal
    const modal = document.getElementById('riderDetailsModal');
    modal.classList.add('show');
}

function contactRider() {
    if (window.currentRiderPhone) {
        window.adminOrders.showToast(`Calling ${window.currentRiderPhone}...`, 'info');
        setTimeout(() => {
            window.open(`tel:${window.currentRiderPhone}`);
        }, 500);
    }
}

function trackRiderLocation() {
    window.adminOrders.showToast('Opening rider location...', 'info');
    // In real app, open map view with rider location
}

function assignNewOrder() {
    window.adminOrders.showToast('Opening order assignment...', 'info');
    // In real app, show available orders to assign
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adminOrders = new AdminOrders();
});
