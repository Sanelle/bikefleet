// scripts.js

document.getElementById('deliveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const pickup = document.getElementById('pickup').value;
    const dropoff = document.getElementById('dropoff').value;
    const transportMode = document.getElementById('transportMode').value;
    const itemType = document.getElementById('itemType').value;
    const itemDetails = document.getElementById('itemDetails').value;
    const priceEstimate = document.getElementById('priceEstimate').value;
    
    let priceMessage = priceEstimate ? `Estimated Price: $${priceEstimate}` : 'Price Estimate not provided.';
    
    alert(`Delivery booked:\nPickup: ${pickup}\nDropoff: ${dropoff}\nTransport Mode: ${transportMode}\nItem Type: ${itemType}\nDetails: ${itemDetails}\n${priceMessage}`);
    
    // Optionally, update priceInfo div
    document.getElementById('priceInfo').textContent = priceMessage;
});

// Example function to load available providers
function loadProviders() {
    const providersList = document.getElementById('providersList');
    
    // Example provider data
    const providers = [
        { name: 'EcoBike Deliveries', details: 'Fast and eco-friendly bike deliveries.' },
        { name: 'CityCycle Couriers', details: 'Reliable bicycle couriers for urban deliveries.' },
        { name: 'GreenRide Services', details: 'Sustainable transportation for small packages.' }
    ];
    
    providersList.innerHTML = providers.map(provider => `
        <div class="provider-card">
            <h3>${provider.name}</h3>
            <p>${provider.details}</p>
        </div>
    `).join('');
}

// Call loadProviders on page load
window.onload = function() {
    loadProviders();
};

function trackDelivery() {
    const trackingId = document.getElementById('trackingId').value;
    const statusDiv = document.getElementById('trackingStatus');
    
    // Mock tracking status for demonstration purposes
    if (trackingId) {
        statusDiv.textContent = `Tracking ID ${trackingId}: Your delivery is on the way!`;
    } else {
        statusDiv.textContent = 'Please enter a tracking ID.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal functionality
    const openModalButtons = document.querySelectorAll('#openBookingModal');
    const modal = document.getElementById('bookingModal');
    const closeButton = document.querySelector('.close-button');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function trackDelivery() {
    const trackingId = document.getElementById('trackingId').value;
    const statusMessage = document.getElementById('trackingStatus');

    // Simulate fetching tracking status (you can replace this with real API call)
    statusMessage.textContent = `Tracking ID: ${trackingId} - Status: In Transit`;
}
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});
document.addEventListener('DOMContentLoaded', function() {
    const providerCards = document.querySelectorAll('.provider-card');
    const providerDescription = document.getElementById('providerDescription');
    const providerModalLabel = document.getElementById('providerModalLabel');

    const providerDetails = {
        bike: {
            title: 'Bike',
            description: 'Bikes are quick and efficient for short-distance deliveries, perfect for congested areas.'
        },
        motorcycle: {
            title: 'Motorcycle',
            description: 'Motorcycles offer fast and reliable delivery services, ideal for both short and long distances.'
        }
        // Add more provider details as needed
    };

    providerCards.forEach(card => {
        card.addEventListener('click', function() {
            const providerType = this.getAttribute('data-provider');
            providerModalLabel.textContent = providerDetails[providerType].title;
            providerDescription.textContent = providerDetails[providerType].description;
        });
    });
});

// Initialize address autocomplete
const places = require('places.js');
const placesAutocomplete = places({
    appId: 'YOUR_ALGOLIA_APP_ID',
    apiKey: 'YOUR_ALGOLIA_API_KEY',
    container: document.querySelector('[data-address-autocomplete]')
});

// Real-time Price Calculation
function calculatePrice() {
    const basePrice = 150;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const insurance = document.getElementById('insurance').value;
    const dimensions = [
        parseFloat(document.getElementById('length').value) || 0,
        parseFloat(document.getElementById('width').value) || 0,
        parseFloat(document.getElementById('height').value) || 0
    ];
    
    // Price adjustments
    let total = basePrice;
    
    // Weight surcharge
    if (weight > 5) total += (weight - 5) * 10;
    
    // Dimension surcharge (volume in liters)
    const volume = (dimensions[0] * dimensions[1] * dimensions[2]) / 1000;
    if (volume > 20) total += (volume - 20) * 5;
    
    // Insurance cost
    const insuranceCost = insurance === 'premium' ? 200 : 50;
    total += insuranceCost;
    
    // Update display
    document.getElementById('insuranceCost').textContent = `₹${insuranceCost}`;
    document.getElementById('totalPrice').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('finalPrice').textContent = total.toFixed(2);
}

// Form Validation and Submission
document.getElementById('deliveryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!e.target.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('was-validated');
        return;
    }

    const formData = {
        pickup: document.getElementById('pickup').value,
        dropoff: document.getElementById('dropoff').value,
        weight: document.getElementById('weight').value,
        dimensions: {
            length: document.getElementById('length').value,
            width: document.getElementById('width').value,
            height: document.getElementById('height').value
        },
        insurance: document.getElementById('insurance').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        instructions: document.getElementById('instructions').value,
        totalPrice: document.getElementById('finalPrice').textContent
    };

    try {
        // Show loading state
        const submitBtn = document.querySelector('#deliveryForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulated API call
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Show success message
            showToast('Booking confirmed! Tracking number: #12345', 'success');
            $('#bookingModal').modal('hide');
        } else {
            throw new Error('Booking failed');
        }
    } catch (error) {
        showToast('Error processing booking. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirm Booking (₹<span id="finalPrice">150</span>)';
    }
});

// Live Price Updates
['weight', 'length', 'width', 'height', 'insurance'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculatePrice);
});
