// Admin Partners JavaScript
class AdminPartners {
    constructor() {
        this.partners = [];
        this.map = null;
        this.markers = [];
        this.selectedPartners = new Set();
        this.filters = {
            status: '',
            zone: '',
            search: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPartners();
        this.initMap();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.filterPartners();
            });
        }

        // Filter selects
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.value.includes('online') || e.target.value.includes('offline') || e.target.value.includes('busy') ? 'status' : 'zone';
                this.filters[filterType] = e.target.value;
                this.filterPartners();
            });
        });

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
        }
    }

    initMap() {
        // Initialize Leaflet map
        this.map = L.map('partnersMap').setView([42.3601, -71.0589], 12); // Boston coordinates

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add sample markers for partners
        this.addPartnerMarkers();
    }

    addPartnerMarkers() {
        // Sample partner locations
        const partnerLocations = [
            { id: 'DRV-101', name: 'John Rider', status: 'online', lat: 42.3601, lng: -71.0589 },
            { id: 'DRV-102', name: 'David Smith', status: 'busy', lat: 42.3656, lng: -71.0643 },
            { id: 'DRV-103', name: 'Alex Kumar', status: 'online', lat: 42.3555, lng: -71.0551 }
        ];

        partnerLocations.forEach(partner => {
            const icon = L.divIcon({
                className: 'partner-marker',
                html: `<div class="marker-content ${partner.status}">
                    <i class="fas fa-motorcycle"></i>
                </div>`,
                iconSize: [30, 30]
            });

            const marker = L.marker([partner.lat, partner.lng], { icon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="partner-popup">
                        <h4>${partner.name}</h4>
                        <p>Status: ${partner.status}</p>
                        <button onclick="viewPartnerDetails('${partner.id}')">View Details</button>
                    </div>
                `);

            this.markers.push(marker);
        });
    }

    showListView() {
        document.getElementById('listView').style.display = 'block';
        document.getElementById('mapView').style.display = 'none';
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    showMapView() {
        document.getElementById('listView').style.display = 'none';
        document.getElementById('mapView').style.display = 'block';
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Refresh map
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    filterPartners() {
        // In real app, filter data and re-render
        console.log('Filtering partners with:', this.filters);
    }

    toggleSelectAll(checked) {
        document.querySelectorAll('.partner-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
            if (checked) {
                this.selectedPartners.add(checkbox.value);
            } else {
                this.selectedPartners.clear();
            }
        });
    }

    viewPartnerDetails(partnerId) {
        // Load partner data and show modal
        const modal = document.getElementById('partnerDetailsModal');
        modal.classList.add('show');
        
        // In real app, fetch and populate partner data
        console.log('Viewing partner:', partnerId);
    }

    trackPartner(partnerId) {
        this.showToast('Opening live tracking...', 'info');
        
        // In real app, open tracking view or update map
        console.log('Tracking partner:', partnerId);
        
        // Switch to map view
        this.showMapView();
    }

    contactPartner(phone) {
        this.showToast(`Calling ${phone}...`, 'info');
        setTimeout(() => {
            window.open(`tel:${phone}`);
        }, 500);
    }

    assignOrder(partnerId) {
        this.showToast('Opening order assignment...', 'info');
        
        // In real app, show order assignment modal
        console.log('Assigning order to partner:', partnerId);
    }

    assignOrderToPartner(partnerId) {
        // Called from modal
        this.showToast('Order assigned successfully!', 'success');
        this.closeModal('partnerDetailsModal');
        
        // In real app, make API call
        console.log('Assigning new order to:', partnerId);
    }

    sendNotification(partnerId) {
        // Show notification options
        if (confirm('Send notification to come online?')) {
            this.showToast('Notification sent successfully', 'success');
            
            // In real app, send push notification
            console.log('Sending notification to:', partnerId);
        }
    }

    addNewPartner() {
        this.showToast('Opening partner registration...', 'info');
        
        // In real app, show registration modal or navigate to registration page
        console.log('Adding new partner');
    }

    exportPartners() {
        this.showToast('Exporting partner data...', 'info');
        
        // In real app, generate CSV/Excel file
        setTimeout(() => {
            this.showToast('Download started', 'success');
        }, 1000);
    }

    loadPartners() {
        // In real app, fetch from API
        console.log('Loading partners...');
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
function showListView() {
    window.adminPartners.showListView();
}

function showMapView() {
    window.adminPartners.showMapView();
}

function viewPartnerDetails(partnerId) {
    window.adminPartners.viewPartnerDetails(partnerId);
}

function trackPartner(partnerId) {
    window.adminPartners.trackPartner(partnerId);
}

function contactPartner(phone) {
    window.adminPartners.contactPartner(phone);
}

function assignOrder(partnerId) {
    window.adminPartners.assignOrder(partnerId);
}

function assignOrderToPartner(partnerId) {
    window.adminPartners.assignOrderToPartner(partnerId);
}

function sendNotification(partnerId) {
    window.adminPartners.sendNotification(partnerId);
}

function addNewPartner() {
    window.adminPartners.addNewPartner();
}

function exportPartners() {
    window.adminPartners.exportPartners();
}

function closeModal(modalId) {
    window.adminPartners.closeModal(modalId);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Add CSS for map markers
const style = document.createElement('style');
style.textContent = `
    .partner-marker {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .marker-content {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        color: white;
    }
    
    .marker-content.online {
        background-color: #4CAF50;
    }
    
    .marker-content.busy {
        background-color: #FF9800;
    }
    
    .marker-content.offline {
        background-color: #9E9E9E;
    }
    
    .partner-popup {
        text-align: center;
    }
    
    .partner-popup h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
    }
    
    .partner-popup p {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
    }
    
    .partner-popup button {
        background-color: #FF9800;
        color: white;
        border: none;
        padding: 0.375rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.adminPartners = new AdminPartners();
});
