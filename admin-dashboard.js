// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.charts = {};
        this.notifications = [];
        this.liveOrders = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initCharts();
        this.startLiveUpdates();
        this.loadNotifications();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Notification toggle
        const notificationBtn = document.querySelector('.notification-wrapper .icon-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.toggleNotifications());
        }

        // Admin menu toggle
        const adminBtn = document.querySelector('.admin-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => this.toggleAdminMenu());
        }

        // Click outside to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-wrapper')) {
                this.closeNotifications();
            }
            if (!e.target.closest('.admin-menu')) {
                this.closeAdminMenu();
            }
        });

        // Period buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateRevenueChart(e.target.textContent.toLowerCase());
            });
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchPerformerTab(e.target.textContent.toLowerCase());
            });
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        
        // Save preference
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        dropdown.classList.toggle('show');
    }

    closeNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        dropdown.classList.remove('show');
    }

    toggleAdminMenu() {
        const dropdown = document.getElementById('adminDropdown');
        dropdown.classList.toggle('show');
    }

    closeAdminMenu() {
        const dropdown = document.getElementById('adminDropdown');
        dropdown.classList.remove('show');
    }

    initCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [3200, 4100, 3800, 4500, 4200, 5100, 4800],
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return '$' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Order Status Chart
        const orderStatusCtx = document.getElementById('orderStatusChart');
        if (orderStatusCtx) {
            this.charts.orderStatus = new Chart(orderStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Delivered', 'Preparing', 'Pending', 'Cancelled'],
                    datasets: [{
                        data: [145, 23, 12, 5],
                        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#F44336'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            cornerRadius: 8
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    updateRevenueChart(period) {
        if (!this.charts.revenue) return;

        let labels, data;
        switch (period) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [3200, 4100, 3800, 4500, 4200, 5100, 4800];
                break;
            case 'month':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [18500, 22300, 21800, 24500];
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = [45000, 48000, 52000, 51000, 54000, 58000, 62000, 65000, 63000, 68000, 70000, 72000];
                break;
        }

        this.charts.revenue.data.labels = labels;
        this.charts.revenue.data.datasets[0].data = data;
        this.charts.revenue.update();
    }

    startLiveUpdates() {
        // Simulate live order updates
        setInterval(() => {
            this.updateLiveOrdersCount();
            this.checkForNewOrders();
        }, 5000);

        // Update order progress
        setInterval(() => {
            this.updateOrderProgress();
        }, 2000);
    }

    updateLiveOrdersCount() {
        const liveIndicator = document.querySelector('.live-indicator span:last-child');
        if (liveIndicator) {
            const count = 20 + Math.floor(Math.random() * 10);
            liveIndicator.textContent = `Live Orders: ${count}`;
        }
    }

    checkForNewOrders() {
        // Simulate new order notification
        if (Math.random() > 0.7) {
            this.addNotification({
                icon: 'fas fa-shopping-cart',
                message: `New order #${Math.floor(Math.random() * 9000) + 1000} received`,
                time: 'Just now',
                type: 'info'
            });
        }
    }

    updateOrderProgress() {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width) || 0;
            if (currentWidth < 100) {
                bar.style.width = `${currentWidth + 10}%`;
            }
        });
    }

    loadNotifications() {
        // Load initial notifications
        this.notifications = [
            {
                icon: 'fas fa-exclamation-circle',
                message: 'New order #2456 needs assignment',
                time: '2 minutes ago',
                type: 'warning',
                unread: true
            },
            {
                icon: 'fas fa-user-plus',
                message: 'New delivery partner registered',
                time: '15 minutes ago',
                type: 'info',
                unread: true
            },
            {
                icon: 'fas fa-store',
                message: 'Restaurant "Pizza Palace" is now online',
                time: '1 hour ago',
                type: 'success'
            }
        ];

        this.renderNotifications();
    }

    addNotification(notification) {
        notification.unread = true;
        this.notifications.unshift(notification);
        this.renderNotifications();
        this.updateNotificationBadge();
        
        // Show toast
        this.showToast(notification.message, notification.type);
    }

    renderNotifications() {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}">
                <i class="${notif.icon} text-${notif.type}"></i>
                <div class="notification-content">
                    <p>${notif.message}</p>
                    <span>${notif.time}</span>
                </div>
            </div>
        `).join('');
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const unreadCount = this.notifications.filter(n => n.unread).length;
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
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

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? 'var(--success)' : 
                               type === 'warning' ? 'var(--warning)' : 
                               type === 'danger' ? 'var(--danger)' : 
                               'var(--info)'};
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

    switchPerformerTab(tab) {
        const restaurantsList = document.getElementById('restaurantsList');
        
        if (tab === 'restaurants') {
            restaurantsList.innerHTML = `
                <div class="performer-item">
                    <span class="rank">1</span>
                    <div class="performer-info">
                        <span class="name">Pizza Palace</span>
                        <span class="metric">45 orders</span>
                    </div>
                    <div class="performer-stats">
                        <span class="revenue">$2,340</span>
                        <span class="rating"><i class="fas fa-star"></i> 4.8</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">2</span>
                    <div class="performer-info">
                        <span class="name">Burger Joint</span>
                        <span class="metric">38 orders</span>
                    </div>
                    <div class="performer-stats">
                        <span class="revenue">$1,890</span>
                        <span class="rating"><i class="fas fa-star"></i> 4.7</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">3</span>
                    <div class="performer-info">
                        <span class="name">Sushi Express</span>
                        <span class="metric">32 orders</span>
                    </div>
                    <div class="performer-stats">
                        <span class="revenue">$2,150</span>
                        <span class="rating"><i class="fas fa-star"></i> 4.9</span>
                    </div>
                </div>
            `;
        } else {
            restaurantsList.innerHTML = `
                <div class="performer-item">
                    <span class="rank">1</span>
                    <div class="performer-info">
                        <span class="name">John Rider</span>
                        <span class="metric">28 deliveries</span>
                    </div>
                    <div class="performer-stats">
                        <span class="revenue">Avg: 22 min</span>
                        <span class="rating"><i class="fas fa-star"></i> 4.9</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">2</span>
                    <div class="performer-info">
                        <span class="name">David Smith</span>
                        <span class="metric">25 deliveries</span>
                    </div>
                    <div class="performer-stats">
                        <span class="revenue">Avg: 24 min</span>
                        <span class="rating"><i class="fas fa-star"></i> 4.8</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">3</span>
                    <div class="performer-info">
                        <span class="name">Alex Kumar</span>
                        <span class="metric">23 deliveries</span>
                    </div>
                    <div class="performer-stats">
                        <span class="revenue">Avg: 25 min</span>
                        <span class="rating"><i class="fas fa-star"></i> 4.7</span>
                    </div>
                </div>
            `;
        }
    }
}

// Global functions
function toggleSidebar() {
    window.adminDashboard.toggleSidebar();
}

function toggleNotifications() {
    window.adminDashboard.toggleNotifications();
}

function toggleAdminMenu() {
    window.adminDashboard.toggleAdminMenu();
}

function viewAllOrders() {
    window.location.href = 'admin-orders.html';
}

function callCustomer(phone) {
    window.adminDashboard.showToast(`Calling customer at ${phone}...`, 'info');
    // In real app, integrate with calling system
    setTimeout(() => {
        window.open(`tel:${phone}`);
    }, 500);
}

function assignOrder(orderId) {
    const modal = document.getElementById('assignOrderModal');
    modal.classList.add('show');
}

function viewOrderDetails(orderId) {
    window.adminDashboard.showToast(`Loading order #${orderId}...`, 'info');
    // In real app, navigate to order details page
    setTimeout(() => {
        window.location.href = `admin-order-detail.html?id=${orderId}`;
    }, 500);
}

function trackRider(riderId) {
    window.adminDashboard.showToast('Opening rider location...', 'info');
    // In real app, open map with rider location
}

function updateOrderStatus(orderId) {
    window.adminDashboard.showToast('Order status updated', 'success');
}

function trackOrder(orderId) {
    window.adminDashboard.showToast('Opening order tracking...', 'info');
    // In real app, open tracking page
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function confirmAssignment() {
    const selectedRider = document.querySelector('input[name="rider"]:checked');
    if (selectedRider) {
        window.adminDashboard.showToast('Order assigned successfully!', 'success');
        closeModal('assignOrderModal');
        // In real app, make API call to assign order
    } else {
        window.adminDashboard.showToast('Please select a delivery partner', 'warning');
    }
}

function createNewOrder() {
    window.location.href = 'admin-create-order.html';
}

function manageRestaurants() {
    window.location.href = 'admin-restaurants.html';
}

function manageRiders() {
    window.location.href = 'admin-partners.html';
}

function viewReports() {
    window.location.href = 'admin-analytics.html';
}

function broadcastMessage() {
    window.adminDashboard.showToast('Opening broadcast center...', 'info');
}

function systemSettings() {
    window.location.href = 'admin-settings.html';
}

function switchPerformerTab(tab) {
    window.adminDashboard.switchPerformerTab(tab);
}

// Add CSS animations
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
`;
document.head.appendChild(style);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
    
    // Restore sidebar state
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
        document.getElementById('sidebar').classList.add('collapsed');
    }
});
