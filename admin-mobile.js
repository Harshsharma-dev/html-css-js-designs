// Admin Mobile JavaScript
class AdminMobile {
    constructor() {
        this.charts = {};
        this.notifications = [];
        this.isMenuOpen = false;
        this.isNotificationsOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initChart();
        this.startLiveUpdates();
        this.setupTouchGestures();
    }

    setupEventListeners() {
        // Menu toggle
        document.querySelector('.menu-btn')?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu on overlay click
        document.querySelector('.sidebar-overlay')?.addEventListener('click', () => this.closeMobileMenu());
        
        // Notifications
        document.querySelector('.header-actions .icon-btn')?.addEventListener('click', () => this.toggleNotifications());
        
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab || e.target.textContent.toLowerCase()));
        });
        
        // Prevent body scroll when modals are open
        document.querySelectorAll('.modal-overlay, .sheet-overlay, .drawer-overlay').forEach(overlay => {
            overlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        });
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Swipe to open menu
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const edgeThreshold = 20;
        
        // Swipe right from left edge to open menu
        if (startX < edgeThreshold && endX - startX > swipeThreshold) {
            this.toggleMobileMenu();
        }
        
        // Swipe left to close menu
        if (this.isMenuOpen && startX - endX > swipeThreshold) {
            this.closeMobileMenu();
        }
        
        // Swipe left to close notifications
        if (this.isNotificationsOpen && startX - endX > swipeThreshold) {
            this.closeNotifications();
        }
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('mobileSidebar');
        sidebar.classList.toggle('show');
        this.isMenuOpen = sidebar.classList.contains('show');
        
        // Prevent body scroll
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('mobileSidebar');
        sidebar.classList.remove('show');
        this.isMenuOpen = false;
        document.body.style.overflow = '';
    }

    toggleNotifications() {
        const drawer = document.getElementById('notificationsDrawer');
        drawer.classList.toggle('show');
        this.isNotificationsOpen = drawer.classList.contains('show');
        
        // Prevent body scroll
        document.body.style.overflow = this.isNotificationsOpen ? 'hidden' : '';
        
        // Mark notifications as read
        if (this.isNotificationsOpen) {
            setTimeout(() => {
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                this.updateNotificationBadge();
            }, 1000);
        }
    }

    closeNotifications() {
        const drawer = document.getElementById('notificationsDrawer');
        drawer.classList.remove('show');
        this.isNotificationsOpen = false;
        document.body.style.overflow = '';
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.header-actions .badge');
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    initChart() {
        const ctx = document.getElementById('mobileRevenueChart');
        if (!ctx) return;

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [3200, 4100, 3800, 4500, 4200, 5100, 4800],
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 4
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
                        padding: 8,
                        cornerRadius: 4,
                        titleFont: { size: 12 },
                        bodyFont: { size: 11 },
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
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: { size: 10 },
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    updateChart(period) {
        if (!this.charts.revenue) return;

        let labels, data;
        switch (period) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [3200, 4100, 3800, 4500, 4200, 5100, 4800];
                break;
            case 'month':
                labels = ['W1', 'W2', 'W3', 'W4'];
                data = [18500, 22300, 21800, 24500];
                break;
            case 'year':
                labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                data = [45000, 48000, 52000, 51000, 54000, 58000, 62000, 65000, 63000, 68000, 70000, 72000];
                break;
        }

        this.charts.revenue.data.labels = labels;
        this.charts.revenue.data.datasets[0].data = data;
        this.charts.revenue.update();
    }

    switchTab(tab) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        // Update content
        const performersList = document.getElementById('performersList');
        if (tab === 'restaurants') {
            performersList.innerHTML = `
                <div class="performer-item">
                    <span class="rank">1</span>
                    <div class="performer-info">
                        <h4>Pizza Palace</h4>
                        <span>45 orders • $2,340</span>
                    </div>
                    <div class="performer-rating">
                        <i class="fas fa-star"></i>
                        <span>4.8</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">2</span>
                    <div class="performer-info">
                        <h4>Burger Joint</h4>
                        <span>38 orders • $1,890</span>
                    </div>
                    <div class="performer-rating">
                        <i class="fas fa-star"></i>
                        <span>4.7</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">3</span>
                    <div class="performer-info">
                        <h4>Sushi Express</h4>
                        <span>32 orders • $2,150</span>
                    </div>
                    <div class="performer-rating">
                        <i class="fas fa-star"></i>
                        <span>4.9</span>
                    </div>
                </div>
            `;
        } else {
            performersList.innerHTML = `
                <div class="performer-item">
                    <span class="rank">1</span>
                    <div class="performer-info">
                        <h4>John Rider</h4>
                        <span>28 deliveries • 22 min avg</span>
                    </div>
                    <div class="performer-rating">
                        <i class="fas fa-star"></i>
                        <span>4.9</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">2</span>
                    <div class="performer-info">
                        <h4>David Smith</h4>
                        <span>25 deliveries • 24 min avg</span>
                    </div>
                    <div class="performer-rating">
                        <i class="fas fa-star"></i>
                        <span>4.8</span>
                    </div>
                </div>
                <div class="performer-item">
                    <span class="rank">3</span>
                    <div class="performer-info">
                        <h4>Alex Kumar</h4>
                        <span>23 deliveries • 25 min avg</span>
                    </div>
                    <div class="performer-rating">
                        <i class="fas fa-star"></i>
                        <span>4.7</span>
                    </div>
                </div>
            `;
        }
    }

    startLiveUpdates() {
        // Update live orders count
        setInterval(() => {
            const liveCount = document.querySelector('.live-indicator span:last-child');
            if (liveCount) {
                const count = 20 + Math.floor(Math.random() * 10);
                liveCount.textContent = `${count} Live`;
            }
        }, 5000);

        // Update order progress
        setInterval(() => {
            document.querySelectorAll('.progress').forEach(bar => {
                const currentWidth = parseInt(bar.style.width) || 0;
                if (currentWidth < 100) {
                    bar.style.width = `${currentWidth + 10}%`;
                }
            });
        }, 2000);
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
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: ${type === 'success' ? '#4CAF50' : 
                               type === 'warning' ? '#FF9800' : 
                               type === 'danger' ? '#F44336' : 
                               '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideUpToast 0.3s ease-out forwards;
        `;

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideDownToast 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    vibrate(pattern = 10) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}

// Global functions
function toggleMobileMenu() {
    window.adminMobile.toggleMobileMenu();
}

function closeMobileMenu() {
    window.adminMobile.closeMobileMenu();
}

function toggleNotifications() {
    window.adminMobile.toggleNotifications();
}

function closeNotifications() {
    window.adminMobile.closeNotifications();
}

function updateChart(period) {
    window.adminMobile.updateChart(period);
}

function switchTab(tab) {
    window.adminMobile.switchTab(tab);
}

function callCustomer(phone) {
    window.adminMobile.vibrate();
    window.adminMobile.showToast(`Calling ${phone}...`, 'info');
    setTimeout(() => {
        window.open(`tel:${phone}`);
    }, 500);
}

function assignOrder(orderId) {
    const modal = document.getElementById('assignModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    window.adminMobile.vibrate();
}

function closeAssignModal() {
    const modal = document.getElementById('assignModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function confirmAssignment() {
    const selectedRider = document.querySelector('input[name="rider"]:checked');
    if (selectedRider) {
        window.adminMobile.showToast('Order assigned successfully!', 'success');
        window.adminMobile.vibrate([10, 10, 10]);
        closeAssignModal();
    } else {
        window.adminMobile.showToast('Please select a delivery partner', 'warning');
        window.adminMobile.vibrate(20);
    }
}

function trackOrder(orderId) {
    window.adminMobile.showToast('Opening map...', 'info');
    window.adminMobile.vibrate();
}

function viewOrder(orderId) {
    window.adminMobile.showToast(`Loading order #${orderId}...`, 'info');
    window.adminMobile.vibrate();
    setTimeout(() => {
        window.location.href = `admin-mobile-order-detail.html?id=${orderId}`;
    }, 500);
}

function createNewOrder() {
    window.location.href = 'admin-mobile-create-order.html';
}

function manageRestaurants() {
    window.location.href = 'admin-mobile-restaurants.html';
}

function manageRiders() {
    window.location.href = 'admin-mobile-partners.html';
}

function viewReports() {
    window.location.href = 'admin-mobile-analytics.html';
}

function showQuickActions() {
    const sheet = document.getElementById('actionSheet');
    sheet.classList.add('show');
    document.body.style.overflow = 'hidden';
    window.adminMobile.vibrate();
}

function hideQuickActions() {
    const sheet = document.getElementById('actionSheet');
    sheet.classList.remove('show');
    document.body.style.overflow = '';
}

function broadcastMessage() {
    hideQuickActions();
    window.adminMobile.showToast('Opening broadcast center...', 'info');
}

function toggleRestaurantStatus() {
    hideQuickActions();
    window.adminMobile.showToast('Opening restaurant manager...', 'info');
}

function viewEmergencyContacts() {
    hideQuickActions();
    window.adminMobile.showToast('Loading emergency contacts...', 'info');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUpToast {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDownToast {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adminMobile = new AdminMobile();
    
    // iOS specific optimizations
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.classList.add('ios');
    }
    
    // Prevent overscroll
    document.body.addEventListener('touchmove', (e) => {
        if (document.body.scrollHeight <= window.innerHeight) {
            e.preventDefault();
        }
    }, { passive: false });
});
