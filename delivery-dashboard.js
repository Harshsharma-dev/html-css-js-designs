// Sample order data
const ordersData = {
    'ORD001': {
        id: 'ORD001',
        store: 'Pizza Palace',
        storeAddress: '789 Restaurant Row, Downtown',
        customer: 'Sarah Johnson',
        customerPhone: '+1 (555) 123-4567',
        deliveryAddress: '123 Main St, Apt 4B',
        items: [
            { name: 'Large Pepperoni Pizza', quantity: 1, price: 18.99 },
            { name: 'Garlic Bread', quantity: 2, price: 6.50 },
            { name: 'Coca Cola 2L', quantity: 1, price: 3.99 }
        ],
        total: 32.50,
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        orderTime: '10:15 AM',
        estimatedDelivery: '11:15 AM',
        specialInstructions: 'Please ring doorbell twice'
    },
    'ORD002': {
        id: 'ORD002',
        store: 'Burger Hub',
        storeAddress: '456 Fast Food Lane',
        customer: 'Mike Chen',
        customerPhone: '+1 (555) 987-6543',
        deliveryAddress: '456 Oak Avenue',
        items: [
            { name: 'Double Cheeseburger', quantity: 2, price: 8.99 },
            { name: 'French Fries', quantity: 2, price: 3.50 },
            { name: 'Milkshake', quantity: 1, price: 4.99 }
        ],
        total: 18.75,
        paymentStatus: 'COD',
        paymentMethod: 'Cash on Delivery',
        orderTime: '09:45 AM',
        estimatedDelivery: '10:45 AM',
        specialInstructions: 'Extra ketchup please'
    },
    'ORD003': {
        id: 'ORD003',
        store: 'Sushi Express',
        storeAddress: '321 Japan Town',
        customer: 'Emily Davis',
        customerPhone: '+1 (555) 246-8135',
        deliveryAddress: '789 Pine Street, Suite 200',
        items: [
            { name: 'Salmon Roll', quantity: 2, price: 12.99 },
            { name: 'California Roll', quantity: 1, price: 8.99 },
            { name: 'Miso Soup', quantity: 2, price: 3.50 },
            { name: 'Edamame', quantity: 1, price: 5.50 }
        ],
        total: 45.00,
        paymentStatus: 'Paid',
        paymentMethod: 'Mobile Payment',
        orderTime: '10:30 AM',
        estimatedDelivery: '11:30 AM',
        specialInstructions: 'No wasabi on the rolls'
    }
};

// Global variables
let map = null;
let trackerMap = null;
let currentOrderId = null;
let uploadedImage = null;
let activeDeliveryOrder = null;
let deliveryStep = 'accepted';

// Delivery flow states
const DELIVERY_STATES = {
    ACCEPTED: 'accepted',
    HEADING_TO_STORE: 'heading',
    AT_STORE: 'pickup',
    OUT_FOR_DELIVERY: 'delivering',
    AT_CUSTOMER: 'complete',
    DELIVERED: 'delivered'
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Online/Offline toggle
    const onlineToggle = document.getElementById('online-toggle');
    onlineToggle.addEventListener('change', function() {
        const statusText = document.getElementById('status');
        if (this.checked) {
            statusText.textContent = 'Online';
            statusText.style.color = 'var(--success)';
        } else {
            statusText.textContent = 'Offline';
            statusText.style.color = 'var(--danger)';
        }
    });
    
    // Photo upload functionality
    const uploadArea = document.getElementById('uploadArea');
    const photoInput = document.getElementById('photoInput');
    
    uploadArea.addEventListener('click', function() {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage = e.target.result;
                displayUploadedImage(uploadedImage);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would filter the orders based on the selected status
        });
    });
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    const dateTimeStr = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').textContent = dateTimeStr;
}

// View order details
function viewOrderDetails(orderId) {
    const order = ordersData[orderId];
    const modalBody = document.getElementById('modalBody');
    
    let itemsHtml = order.items.map(item => `
        <div class="order-item">
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
            </div>
            <span class="item-price">$${item.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    modalBody.innerHTML = `
        <div class="order-detail-section">
            <h3>Order Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="label">Order ID:</span>
                    <span class="value">${order.id}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Order Time:</span>
                    <span class="value">${order.orderTime}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Est. Delivery:</span>
                    <span class="value">${order.estimatedDelivery}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Payment:</span>
                    <span class="value">${order.paymentMethod} (${order.paymentStatus})</span>
                </div>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h3>Store Information</h3>
            <p><i class="fas fa-store"></i> ${order.store}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${order.storeAddress}</p>
        </div>
        
        <div class="order-detail-section">
            <h3>Customer Information</h3>
            <p><i class="fas fa-user"></i> ${order.customer}</p>
            <p><i class="fas fa-phone"></i> ${order.customerPhone}</p>
            <p><i class="fas fa-home"></i> ${order.deliveryAddress}</p>
        </div>
        
        <div class="order-detail-section">
            <h3>Order Items</h3>
            <div class="items-list">
                ${itemsHtml}
                <div class="order-total">
                    <span>Total Amount</span>
                    <span class="total-price">$${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        ${order.specialInstructions ? `
        <div class="order-detail-section">
            <h3>Special Instructions</h3>
            <p class="special-instructions">${order.specialInstructions}</p>
        </div>
        ` : ''}
        
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="showMap('${orderId}')">
                <i class="fas fa-map"></i> View on Map
            </button>
        </div>
    `;
    
    document.getElementById('orderModal').style.display = 'block';
}

// Start delivery
function startDelivery(orderId) {
    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
    const statusBadge = orderCard.querySelector('.order-status');
    statusBadge.className = 'order-status in-transit';
    statusBadge.textContent = 'In Transit';
    
    const actionButton = orderCard.querySelector('.btn-primary');
    actionButton.className = 'btn btn-success';
    actionButton.innerHTML = '<i class="fas fa-check"></i> Complete Delivery';
    actionButton.onclick = () => completeDelivery(orderId);
    
    // Show notification
    showNotification('Delivery started for Order #' + orderId);
}

// Complete delivery
function completeDelivery(orderId) {
    currentOrderId = orderId;
    const order = ordersData[orderId];
    
    document.getElementById('delivery-order-id').textContent = orderId;
    document.getElementById('delivery-customer').textContent = order.customer;
    document.getElementById('delivery-address').textContent = order.deliveryAddress;
    
    // Reset upload area
    uploadedImage = null;
    document.getElementById('uploadPlaceholder').style.display = 'block';
    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('photoInput').value = '';
    document.getElementById('deliveryNotes').value = '';
    document.getElementById('handedToCustomer').checked = false;
    document.getElementById('leftAtDoor').checked = false;
    
    document.getElementById('deliveryModal').style.display = 'block';
}

// Navigate to store
function navigateToStore(orderId) {
    showMap(orderId, true);
}

// Display uploaded image
function displayUploadedImage(imageSrc) {
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('previewImage');
    
    placeholder.style.display = 'none';
    preview.src = imageSrc;
    preview.style.display = 'block';
}

// Confirm delivery
function confirmDelivery() {
    if (!uploadedImage) {
        showNotification('Please upload a photo of the delivered item', 'warning');
        return;
    }
    
    const handedToCustomer = document.getElementById('handedToCustomer').checked;
    const leftAtDoor = document.getElementById('leftAtDoor').checked;
    
    if (!handedToCustomer && !leftAtDoor) {
        showNotification('Please select delivery method', 'warning');
        return;
    }
    
    // Here you would send the delivery confirmation to the server
    const orderCard = document.querySelector(`[data-order-id="${currentOrderId}"]`);
    orderCard.style.opacity = '0.5';
    orderCard.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        orderCard.remove();
        closeDeliveryModal();
        showNotification(`Order #${currentOrderId} delivered successfully!`, 'success');
        updateStats();
    }, 500);
}

// Show map
function showMap(orderId, navigateToStore = false) {
    const order = ordersData[orderId];
    
    document.getElementById('pickup-location').textContent = order.storeAddress;
    document.getElementById('delivery-location').textContent = order.deliveryAddress;
    
    // Close the order details modal if open
    closeModal();
    
    // Show map modal
    document.getElementById('mapModal').style.display = 'block';
    
    // Initialize map if not already done
    setTimeout(() => {
        if (!map) {
            map = L.map('map').setView([40.7128, -74.0060], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        }
        
        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        
        // Add sample markers (in real app, these would be geocoded addresses)
        const storeLocation = [40.7128, -74.0060];
        const deliveryLocation = [40.7228, -74.0160];
        
        // Store marker
        L.marker(storeLocation)
            .addTo(map)
            .bindPopup(`<b>${order.store}</b><br>${order.storeAddress}`)
            .openPopup();
        
        // Delivery marker
        L.marker(deliveryLocation)
            .addTo(map)
            .bindPopup(`<b>Delivery Address</b><br>${order.deliveryAddress}`);
        
        // Fit map to show both markers
        const bounds = L.latLngBounds([storeLocation, deliveryLocation]);
        map.fitBounds(bounds, { padding: [50, 50] });
        
        // Draw route line (simplified)
        L.polyline([storeLocation, deliveryLocation], {
            color: 'var(--primary-orange)',
            weight: 4,
            opacity: 0.7
        }).addTo(map);
    }, 100);
}

// Open in maps app
function openInMaps() {
    // In a real app, this would open the native maps app with directions
    showNotification('Opening in Maps app...', 'info');
}

// Update stats (simulated) - Stats removed from UI
function updateStats() {
    // Stats cards have been removed from the dashboard
    // This function is kept to prevent errors in existing code
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
            z-index: 2000;
        }
        
        .notification.success {
            background-color: var(--success);
        }
        
        .notification.warning {
            background-color: var(--warning);
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
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Modal close functions
function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function closeDeliveryModal() {
    document.getElementById('deliveryModal').style.display = 'none';
}

function closeMapModal() {
    document.getElementById('mapModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Additional styles for order details modal
const additionalStyles = `
    .order-detail-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
    }
    
    .order-detail-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .order-detail-section h3 {
        font-size: 1.125rem;
        color: var(--text-dark);
        margin-bottom: 1rem;
    }
    
    .order-detail-section p {
        margin-bottom: 0.5rem;
        color: var(--text-light);
    }
    
    .order-detail-section i {
        width: 20px;
        color: var(--primary-orange);
        margin-right: 0.5rem;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
    }
    
    .detail-item .label {
        font-size: 0.875rem;
        color: var(--text-light);
        margin-bottom: 0.25rem;
    }
    
    .detail-item .value {
        font-weight: 600;
        color: var(--text-dark);
    }
    
    .items-list {
        background-color: var(--background);
        padding: 1rem;
        border-radius: 8px;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
    }
    
    .order-item:last-child {
        border-bottom: none;
    }
    
    .item-details {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .item-name {
        font-weight: 500;
        color: var(--text-dark);
    }
    
    .item-quantity {
        color: var(--text-light);
        font-size: 0.875rem;
    }
    
    .item-price {
        font-weight: 600;
        color: var(--primary-orange);
    }
    
    .order-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid var(--border);
        font-weight: 600;
    }
    
    .total-price {
        font-size: 1.25rem;
        color: var(--primary-orange);
    }
    
    .special-instructions {
        background-color: rgba(255, 152, 0, 0.1);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid var(--primary-orange);
        font-style: italic;
    }
`;

// Add additional styles to the page
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);

// Simulate new order assignment
function simulateNewOrder() {
    const newOrder = {
        id: 'ORD004',
        store: 'Thai Kitchen',
        storeAddress: '567 Asian Food Court',
        customer: 'Alex Williams',
        customerPhone: '+1 (555) 369-2580',
        deliveryAddress: '321 Elm Street, Unit 12',
        total: 28.50,
        estimatedDelivery: '12:15 PM'
    };
    
    document.getElementById('assigned-order-id').textContent = newOrder.id;
    document.getElementById('assigned-store').textContent = newOrder.store;
    document.getElementById('assigned-customer').textContent = newOrder.customer;
    document.getElementById('assigned-time').textContent = newOrder.estimatedDelivery;
    
    document.getElementById('assignmentNotification').style.display = 'block';
    
    // Play notification sound (if implemented)
    playNotificationSound();
}

// Accept order
function acceptOrder() {
    const orderId = document.getElementById('assigned-order-id').textContent;
    activeDeliveryOrder = orderId;
    
    // Hide notification
    document.getElementById('assignmentNotification').style.display = 'none';
    
    // Show delivery tracker
    document.getElementById('tracker-order-id').textContent = orderId;
    showDeliveryTracker();
    
    // Update first step
    updateDeliveryStep(DELIVERY_STATES.ACCEPTED);
    
    // Show notification
    showNotification(`Order #${orderId} accepted! Navigate to store.`, 'success');
    
    // Start navigation to store
    setTimeout(() => {
        updateDeliveryStep(DELIVERY_STATES.HEADING_TO_STORE);
        updateETA('store-eta', '5 mins');
        initTrackerMap();
    }, 1000);
}

// Reject order
function rejectOrder() {
    document.getElementById('assignmentNotification').style.display = 'none';
    showNotification('Order rejected. It will be assigned to another driver.', 'info');
}

// Show delivery tracker
function showDeliveryTracker() {
    document.getElementById('deliveryTracker').classList.add('active');
}

// Close tracker
function closeTracker() {
    document.getElementById('deliveryTracker').classList.remove('active');
}

// Update delivery step
function updateDeliveryStep(step) {
    deliveryStep = step;
    
    // Reset all steps
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active', 'completed');
    });
    
    // Update steps based on current state
    switch(step) {
        case DELIVERY_STATES.ACCEPTED:
            document.getElementById('step-accepted').classList.add('completed');
            break;
        case DELIVERY_STATES.HEADING_TO_STORE:
            document.getElementById('step-accepted').classList.add('completed');
            document.getElementById('step-heading').classList.add('active');
            break;
        case DELIVERY_STATES.AT_STORE:
            document.getElementById('step-accepted').classList.add('completed');
            document.getElementById('step-heading').classList.add('completed');
            document.getElementById('step-pickup').classList.add('active');
            break;
        case DELIVERY_STATES.OUT_FOR_DELIVERY:
            document.getElementById('step-accepted').classList.add('completed');
            document.getElementById('step-heading').classList.add('completed');
            document.getElementById('step-pickup').classList.add('completed');
            document.getElementById('step-delivering').classList.add('active');
            break;
        case DELIVERY_STATES.AT_CUSTOMER:
            document.getElementById('step-accepted').classList.add('completed');
            document.getElementById('step-heading').classList.add('completed');
            document.getElementById('step-pickup').classList.add('completed');
            document.getElementById('step-delivering').classList.add('completed');
            document.getElementById('step-complete').classList.add('active');
            break;
    }
}

// Arrived at store
function arrivedAtStore() {
    updateDeliveryStep(DELIVERY_STATES.AT_STORE);
    showNotification('Arrived at store. Please collect the order.', 'info');
}

// Confirm pickup
function confirmPickup() {
    updateDeliveryStep(DELIVERY_STATES.OUT_FOR_DELIVERY);
    updateETA('customer-eta', '12 mins');
    showNotification('Order picked up! Navigate to customer.', 'success');
    
    // Update order status in main dashboard
    updateOrderStatus(activeDeliveryOrder, 'Out for Delivery');
}

// Arrived at customer
function arrivedAtCustomer() {
    updateDeliveryStep(DELIVERY_STATES.AT_CUSTOMER);
    showNotification('Arrived at customer location.', 'info');
}

// Open delivery completion
function openDeliveryCompletion() {
    completeDelivery(activeDeliveryOrder);
}

// Update ETA
function updateETA(elementId, time) {
    document.getElementById(elementId).textContent = `ETA: ${time}`;
}

// Initialize tracker map
function initTrackerMap() {
    if (!trackerMap) {
        trackerMap = L.map('trackerMap').setView([40.7128, -74.0060], 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(trackerMap);
    }
    
    // Clear existing markers
    trackerMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            trackerMap.removeLayer(layer);
        }
    });
    
    // Add delivery route
    const storeLocation = [40.7128, -74.0060];
    const customerLocation = [40.7228, -74.0160];
    const currentLocation = [40.7178, -74.0110]; // Driver's current location
    
    // Store marker
    L.marker(storeLocation, {
        icon: L.divIcon({
            html: '<i class="fas fa-store" style="color: #FF9800;"></i>',
            iconSize: [30, 30],
            className: 'custom-div-icon'
        })
    }).addTo(trackerMap).bindPopup('Store Location');
    
    // Customer marker
    L.marker(customerLocation, {
        icon: L.divIcon({
            html: '<i class="fas fa-home" style="color: #4CAF50;"></i>',
            iconSize: [30, 30],
            className: 'custom-div-icon'
        })
    }).addTo(trackerMap).bindPopup('Customer Location');
    
    // Driver marker
    L.marker(currentLocation, {
        icon: L.divIcon({
            html: '<i class="fas fa-motorcycle" style="color: #2196F3;"></i>',
            iconSize: [30, 30],
            className: 'custom-div-icon'
        })
    }).addTo(trackerMap).bindPopup('Your Location');
    
    // Draw route
    L.polyline([storeLocation, currentLocation, customerLocation], {
        color: '#FF9800',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(trackerMap);
    
    // Fit bounds
    trackerMap.fitBounds([storeLocation, customerLocation], { padding: [50, 50] });
}

// Update order status in main list
function updateOrderStatus(orderId, status) {
    const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
    if (orderCard) {
        const statusBadge = orderCard.querySelector('.order-status');
        statusBadge.textContent = status;
        statusBadge.className = 'order-status in-transit';
    }
}

// Report issue
function reportIssue() {
    const issues = [
        'Cannot find customer address',
        'Customer not responding',
        'Order items missing',
        'Vehicle breakdown',
        'Other'
    ];
    
    const selectedIssue = prompt('Select an issue:\n' + issues.map((issue, index) => `${index + 1}. ${issue}`).join('\n'));
    
    if (selectedIssue) {
        showNotification('Issue reported. Support team will contact you shortly.', 'warning');
    }
}

// Contact support
function contactSupport() {
    showNotification('Connecting to support...', 'info');
    // In real app, this would open a chat or call interface
}

// Play notification sound
function playNotificationSound() {
    // Simple notification sound (you can replace with actual sound file)
    try {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAECcAACBOAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt';
        audio.play().catch(e => console.log('Could not play notification sound'));
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Add custom marker styles
const markerStyles = `
    .custom-div-icon {
        background: transparent;
        border: none;
        font-size: 24px;
        text-align: center;
    }
`;

const markerStyleElement = document.createElement('style');
markerStyleElement.textContent = markerStyles;
document.head.appendChild(markerStyleElement);

// Enhanced complete delivery function
function confirmDelivery() {
    if (!uploadedImage) {
        showNotification('Please upload a photo of the delivered item', 'warning');
        return;
    }
    
    const handedToCustomer = document.getElementById('handedToCustomer').checked;
    const leftAtDoor = document.getElementById('leftAtDoor').checked;
    
    if (!handedToCustomer && !leftAtDoor) {
        showNotification('Please select delivery method', 'warning');
        return;
    }
    
    // Update delivery status
    const orderCard = document.querySelector(`[data-order-id="${currentOrderId}"]`);
    if (orderCard) {
        orderCard.style.opacity = '0.5';
        orderCard.style.transition = 'opacity 0.5s ease';
    }
    
    setTimeout(() => {
        if (orderCard) {
            orderCard.remove();
        }
        closeDeliveryModal();
        closeTracker();
        showNotification(`Order #${currentOrderId} delivered successfully!`, 'success');
        updateStats();
        activeDeliveryOrder = null;
        deliveryStep = 'accepted';
    }, 500);
}

// Demo: Trigger new order assignment after 3 seconds
setTimeout(() => {
    simulateNewOrder();
}, 3000);
