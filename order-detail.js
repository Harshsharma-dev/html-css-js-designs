// Order Detail JavaScript
class OrderDetailManager {
    constructor() {
        this.orderId = this.getOrderIdFromURL();
        this.map = null;
        this.driverMarker = null;
        this.orderData = {
            id: 'YH689H',
            status: 'preparing',
            placedAt: '2025-08-20T13:07:00',
            estimatedDelivery: '2025-08-25T14:00:00',
            customer: {
                name: 'John Doe',
                phone: '+1 (617) 555-0123',
                address: '205A, Boston, Massachusetts, 02134'
            },
            restaurant: {
                name: 'SubCater Kitchen',
                address: '100 Summer St, Boston, MA 02110',
                lat: 42.3554,
                lng: -71.0531
            },
            delivery: {
                lat: 42.3601,
                lng: -71.0589,
                driver: {
                    name: 'Michael',
                    phone: '+1 (617) 555-9876',
                    photo: 'https://i.pravatar.cc/60?img=5',
                    vehicle: 'Honda Civic - ABC 123'
                }
            },
            items: [
                {
                    name: 'Easy Order sandwich',
                    description: '12 serves',
                    notes: 'Bread type: Remove from All Chips',
                    quantity: 1,
                    price: 101.72,
                    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop'
                },
                {
                    name: 'Classic Burger Combo',
                    description: 'With fries and drink',
                    notes: 'Extra cheese, no onions',
                    quantity: 2,
                    price: 29.98,
                    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=100&h=100&fit=crop'
                }
            ],
            billing: {
                subtotal: 131.74,
                deliveryFee: 10.00,
                tax: 9.22,
                discount: 15.00,
                pointsUsed: 7.12,
                total: 128.84,
                paymentMethod: 'Credit Card',
                paymentLast4: '4242'
            },
            points: 128,
            event: 'Birthday Party'
        };
        
        this.init();
    }
    
    init() {
        this.loadOrderDetails();
        this.setupEventListeners();
        this.startStatusUpdates();
        this.initializeAnimations();
    }
    
    getOrderIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'YH689H';
    }
    
    loadOrderDetails() {
        // In a real app, this would fetch from API
        console.log('Loading order details for:', this.orderId);
        
        // Update page with order data
        this.updateOrderHeader();
        this.updateTrackingStatus();
        this.updateBillingSummary();
    }
    
    updateOrderHeader() {
        // Update order ID in header
        const headerElement = document.querySelector('.header-left h2');
        if (headerElement) {
            headerElement.textContent = `Order #${this.orderData.id}`;
        }
        
        // Update placed date
        const dateElement = document.querySelector('.order-date');
        if (dateElement) {
            const placedDate = new Date(this.orderData.placedAt);
            const formattedDate = placedDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            dateElement.innerHTML = `<i class="fas fa-calendar"></i> Placed on ${formattedDate}`;
        }
    }
    
    updateTrackingStatus() {
        // Simulate real-time updates
        const statuses = ['placed', 'preparing', 'out-for-delivery', 'delivered'];
        const currentIndex = statuses.indexOf(this.orderData.status);
        
        // Update timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            if (index <= currentIndex) {
                item.classList.add('completed');
            }
            if (index === currentIndex) {
                item.classList.add('active');
            }
        });
    }
    
    updateBillingSummary() {
        const billing = this.orderData.billing;
        
        // Update bill items
        const billItems = document.querySelectorAll('.bill-item span:last-child');
        if (billItems.length >= 5) {
            billItems[0].textContent = `$${billing.subtotal.toFixed(2)}`;
            billItems[1].textContent = `$${billing.deliveryFee.toFixed(2)}`;
            billItems[2].textContent = `$${billing.tax.toFixed(2)}`;
            billItems[3].textContent = `-$${billing.discount.toFixed(2)}`;
            billItems[4].textContent = `-$${billing.pointsUsed.toFixed(2)}`;
        }
        
        // Update total
        const totalElement = document.querySelector('.bill-total span:last-child');
        if (totalElement) {
            totalElement.textContent = `$${billing.total.toFixed(2)}`;
        }
    }
    
    setupEventListeners() {
        // Add event listeners for all interactive elements
        this.setupModalListeners();
        this.setupActionListeners();
    }
    
    setupModalListeners() {
        // Close modal when clicking outside
        const modal = document.getElementById('liveTrackingModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeLiveTracking();
                }
            });
        }
    }
    
    setupActionListeners() {
        // Setup keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLiveTracking();
            }
        });
    }
    
    startStatusUpdates() {
        // Simulate real-time status updates
        setInterval(() => {
            this.checkForStatusUpdates();
        }, 30000); // Check every 30 seconds
    }
    
    checkForStatusUpdates() {
        // In a real app, this would poll the API
        console.log('Checking for order updates...');
        
        // Simulate driver location updates when tracking is open
        if (this.map && this.driverMarker) {
            this.updateDriverLocation();
        }
    }
    
    updateDriverLocation() {
        // Simulate driver movement
        const currentPos = this.driverMarker.getLatLng();
        const newLat = currentPos.lat + (Math.random() - 0.5) * 0.001;
        const newLng = currentPos.lng + (Math.random() - 0.5) * 0.001;
        
        this.driverMarker.setLatLng([newLat, newLng]);
        
        // Update ETA
        const etaElement = document.querySelector('.delivery-eta span');
        if (etaElement) {
            const eta = Math.floor(Math.random() * 10) + 10;
            etaElement.textContent = `Arriving in ${eta}-${eta + 5} minutes`;
        }
    }
    
    initializeAnimations() {
        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Global functions for button actions
function downloadInvoice() {
    showNotification('Preparing invoice download...', 'info');
    // In a real app, this would generate and download PDF
    setTimeout(() => {
        showNotification('Invoice downloaded successfully!', 'success');
    }, 1500);
}

function openLiveTracking() {
    const modal = document.getElementById('liveTrackingModal');
    modal.style.display = 'flex';
    
    // Initialize map
    setTimeout(() => {
        initializeTrackingMap();
    }, 100);
}

function closeLiveTracking() {
    const modal = document.getElementById('liveTrackingModal');
    modal.style.display = 'none';
}

function initializeTrackingMap() {
    const mapElement = document.getElementById('trackingMap');
    if (!mapElement || window.orderDetailManager.map) return;
    
    // Initialize Leaflet map
    const map = L.map('trackingMap').setView([42.3601, -71.0589], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Restaurant marker
    const restaurantIcon = L.divIcon({
        html: '<div class="map-marker restaurant"><i class="fas fa-store"></i></div>',
        iconSize: [40, 40],
        className: ''
    });
    
    L.marker([42.3554, -71.0531], { icon: restaurantIcon })
        .addTo(map)
        .bindPopup('SubCater Kitchen');
    
    // Delivery location marker
    const homeIcon = L.divIcon({
        html: '<div class="map-marker home"><i class="fas fa-home"></i></div>',
        iconSize: [40, 40],
        className: ''
    });
    
    L.marker([42.3601, -71.0589], { icon: homeIcon })
        .addTo(map)
        .bindPopup('Delivery Address');
    
    // Driver marker
    const driverIcon = L.divIcon({
        html: '<div class="map-marker driver"><i class="fas fa-motorcycle"></i></div>',
        iconSize: [40, 40],
        className: ''
    });
    
    const driverMarker = L.marker([42.3577, -71.0560], { icon: driverIcon })
        .addTo(map)
        .bindPopup("Michael - Your delivery partner");
    
    // Draw route
    const routeCoordinates = [
        [42.3554, -71.0531], // Restaurant
        [42.3577, -71.0560], // Current driver location
        [42.3601, -71.0589]  // Delivery location
    ];
    
    L.polyline(routeCoordinates, {
        color: '#FF9800',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);
    
    // Store references
    window.orderDetailManager.map = map;
    window.orderDetailManager.driverMarker = driverMarker;
    
    // Add custom styles for markers
    if (!document.getElementById('map-marker-styles')) {
        const style = document.createElement('style');
        style.id = 'map-marker-styles';
        style.textContent = `
            .map-marker {
                background-color: white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            .map-marker.restaurant {
                color: var(--primary-orange);
                border: 2px solid var(--primary-orange);
            }
            .map-marker.home {
                color: var(--success);
                border: 2px solid var(--success);
            }
            .map-marker.driver {
                color: var(--info);
                border: 2px solid var(--info);
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

function viewOnMap() {
    openLiveTracking();
}

function contactDriver() {
    showNotification('Connecting to driver...', 'info');
    // In a real app, this would open chat or call interface
}

function callDriver() {
    const driverPhone = window.orderDetailManager.orderData.delivery.driver.phone;
    window.location.href = `tel:${driverPhone}`;
}

function reorderItems() {
    showNotification('Adding items to cart...', 'success');
    // In a real app, this would add items to cart and redirect
    setTimeout(() => {
        window.location.href = 'menu.html';
    }, 1500);
}

function getHelp() {
    showNotification('Opening support chat...', 'info');
    // In a real app, this would open chat widget
}

function rateOrder() {
    // In a real app, this would open rating modal
    const rating = prompt('Rate your order from 1-5 stars:');
    if (rating && rating >= 1 && rating <= 5) {
        showNotification('Thank you for your feedback!', 'success');
    }
}

function shareOrder() {
    if (navigator.share) {
        navigator.share({
            title: 'My SubCater Order',
            text: `Check out my order #${window.orderDetailManager.orderData.id}`,
            url: window.location.href
        }).then(() => {
            showNotification('Order shared successfully!', 'success');
        }).catch(() => {
            console.log('Share cancelled');
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Order link copied to clipboard!', 'success');
        });
    }
}

// Notification system (reuse from order-list.js)
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
                z-index: 2000;
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
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.orderDetailManager = new OrderDetailManager();
});
