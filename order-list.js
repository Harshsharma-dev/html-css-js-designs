// Order List JavaScript
class OrderManager {
    constructor() {
        this.orders = {
            scheduled: [
                {
                    id: 'YH689H',
                    status: 'preparing',
                    customer: 'John Doe',
                    date: '2025-07-12',
                    time: '2:30pm',
                    location: 'Boston, MA',
                    event: 'Birthday Party',
                    items: [
                        { name: 'Deluxe Party Platter', description: 'Serves 10-12 people', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop' }
                    ],
                    itemCount: 4,
                    total: 156.80,
                    estimatedDelivery: 45,
                    trackingStep: 2
                },
                {
                    id: 'YH690K',
                    status: 'scheduled',
                    customer: 'Jane Smith',
                    date: '2025-07-15',
                    time: '6:00pm',
                    location: 'Cambridge, MA',
                    event: 'Corporate Meeting',
                    items: [
                        { name: 'Business Lunch Set', description: '20 box lunches', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop' }
                    ],
                    itemCount: 3,
                    total: 285.00,
                    trackingStep: 0
                }
            ],
            completed: [],
            cancelled: [],
            draft: []
        };
        
        this.currentTab = 'scheduled';
        this.init();
    }
    
    init() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        this.setupTabListeners();
        this.renderOrders();
        this.setupMobileMenu();
        this.checkForURLParams();
    }
    
    updateDateTime() {
        const now = new Date();
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (dateElement) {
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', dateOptions).replace(/\//g, '-');
        }
        
        if (timeElement) {
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
        }
    }
    
    setupTabListeners() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.switchTab(status);
            });
        });
    }
    
    switchTab(status) {
        // Update active tab
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        const activeTab = document.querySelector(`[data-status="${status}"]`);
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        
        this.currentTab = status;
        this.renderOrders();
    }
    
    renderOrders() {
        const container = document.querySelector('.orders-container');
        const emptyState = document.querySelector('.empty-state');
        const orders = this.orders[this.currentTab];
        
        if (orders.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            container.style.display = 'flex';
            emptyState.style.display = 'none';
            
            container.innerHTML = orders.map(order => this.renderOrderCard(order)).join('');
            
            // Update tracking progress
            if (this.currentTab === 'scheduled') {
                this.updateTrackingProgress();
            }
        }
    }
    
    renderOrderCard(order) {
        const isActive = order.status === 'preparing' || order.status === 'on-the-way';
        const statusIcon = this.getStatusIcon(order.status);
        const statusText = this.getStatusText(order.status);
        
        return `
            <div class="order-card ${isActive ? 'active' : ''}">
                <div class="order-header">
                    <div class="order-main-info">
                        <h3 class="order-id">Order #${order.id}</h3>
                        <div class="order-meta">
                            <span class="order-date">
                                <i class="fas fa-calendar"></i>
                                ${order.date}, ${order.time}
                            </span>
                            <span class="order-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${order.location}
                            </span>
                            <span class="order-event">
                                <i class="fas ${this.getEventIcon(order.event)}"></i>
                                ${order.event}
                            </span>
                        </div>
                    </div>
                    <div class="order-status ${order.status}">
                        <i class="fas ${statusIcon}"></i>
                        ${statusText}
                    </div>
                </div>
                
                <div class="order-content">
                    <div class="order-items">
                        <div class="item-preview">
                            <img src="${order.items[0].image}" alt="${order.items[0].name}">
                            <div class="item-details">
                                <h4>${order.items[0].name}</h4>
                                <p>${order.items[0].description}</p>
                            </div>
                        </div>
                        ${order.itemCount > 1 ? `<div class="item-count">+${order.itemCount - 1} more items</div>` : ''}
                    </div>
                    
                    ${isActive ? this.renderTracking(order) : ''}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        <span>Total:</span>
                        <strong>$${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        ${this.renderActionButton(order)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTracking(order) {
        const steps = ['Order Placed', 'Preparing', 'On the Way', 'Delivered'];
        const stepIcons = ['fa-check', 'fa-utensils', 'fa-truck', 'fa-check-circle'];
        
        return `
            <div class="order-tracking">
                <div class="tracking-steps">
                    ${steps.map((step, index) => `
                        <div class="step ${index < order.trackingStep ? 'completed' : ''} ${index === order.trackingStep ? 'active' : ''}">
                            <div class="step-icon">
                                <i class="fas ${stepIcons[index]}"></i>
                            </div>
                            <span>${step}</span>
                        </div>
                    `).join('')}
                </div>
                ${order.estimatedDelivery ? `
                    <div class="estimated-time">
                        <i class="fas fa-clock"></i>
                        Estimated delivery in ${order.estimatedDelivery} mins
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderActionButton(order) {
        switch (order.status) {
            case 'preparing':
            case 'on-the-way':
                return `
                    <button class="btn btn-primary" onclick="trackOrder('${order.id}')">
                        <i class="fas fa-map-marked-alt"></i>
                        Track Order
                    </button>
                `;
            case 'scheduled':
                return `
                    <button class="btn btn-outline" onclick="modifyOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                        Modify Order
                    </button>
                `;
            case 'delivered':
                return `
                    <button class="btn btn-primary" onclick="reorder('${order.id}')">
                        <i class="fas fa-redo"></i>
                        Reorder
                    </button>
                `;
            case 'cancelled':
                return `
                    <button class="btn btn-outline" onclick="viewCancellationDetails('${order.id}')">
                        <i class="fas fa-info-circle"></i>
                        View Details
                    </button>
                `;
            default:
                return '';
        }
    }
    
    getStatusIcon(status) {
        const icons = {
            'preparing': 'fa-clock',
            'scheduled': 'fa-calendar-check',
            'on-the-way': 'fa-truck',
            'delivered': 'fa-check-circle',
            'cancelled': 'fa-times-circle'
        };
        return icons[status] || 'fa-info-circle';
    }
    
    getStatusText(status) {
        const texts = {
            'preparing': 'Preparing',
            'scheduled': 'Scheduled',
            'on-the-way': 'On the Way',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return texts[status] || status;
    }
    
    getEventIcon(event) {
        const icons = {
            'Birthday Party': 'fa-birthday-cake',
            'Corporate Meeting': 'fa-briefcase',
            'Wedding': 'fa-heart',
            'Picnic': 'fa-tree',
            'Other': 'fa-calendar-alt'
        };
        return icons[event] || 'fa-calendar-alt';
    }
    
    updateTrackingProgress() {
        // Simulate progress updates
        setInterval(() => {
            const activeOrders = this.orders.scheduled.filter(o => o.status === 'preparing' || o.status === 'on-the-way');
            activeOrders.forEach(order => {
                if (order.estimatedDelivery > 0) {
                    order.estimatedDelivery -= 1;
                    if (order.estimatedDelivery % 15 === 0 && order.trackingStep < 3) {
                        order.trackingStep += 1;
                        this.renderOrders();
                    }
                }
            });
        }, 60000); // Update every minute
    }
    
    setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                // Toggle mobile menu
                console.log('Mobile menu toggled');
            });
        }
    }
    
    checkForURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order');
        const action = urlParams.get('action');
        
        if (orderId && action === 'track') {
            setTimeout(() => trackOrder(orderId), 1000);
        }
    }
}

// Global functions for button actions
function viewOrderDetails(orderId) {
    window.location.href = `order-detail.html?id=${orderId}`;
}

function trackOrder(orderId) {
    // Open tracking modal or navigate to tracking page
    console.log('Tracking order:', orderId);
    showNotification('Opening real-time tracking...', 'info');
}

function modifyOrder(orderId) {
    console.log('Modifying order:', orderId);
    showNotification('Redirecting to order modification...', 'info');
}

function reorder(orderId) {
    console.log('Reordering:', orderId);
    showNotification('Adding items to cart...', 'success');
}

function viewCancellationDetails(orderId) {
    console.log('Viewing cancellation details:', orderId);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--gray-900);
                color: var(--white);
                padding: var(--space-md) var(--space-lg);
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                box-shadow: var(--shadow-lg);
                animation: slideIn 0.3s ease-out;
                z-index: 1000;
            }
            
            .notification.success {
                background-color: var(--success);
            }
            
            .notification.error {
                background-color: var(--danger);
            }
            
            .notification.info {
                background-color: var(--info);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new OrderManager();
});
