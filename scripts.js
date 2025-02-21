// Global variable to simulate current user authentication status
let currentUser = null;

// Demo user data for testing
const demoUser = {
  id: 1,
  name: "Demo User",
  email: "demo@bikefleet.com",
  paymentInfo: "**** **** **** 1234",
  trips: [
    {
      id: 1,
      status: "Completed",
      price: 25.0,
      rating: 4.5,
      date: "2023-07-15"
    },
    {
      id: 2,
      status: "In Progress",
      price: 30.0,
      rating: null,
      date: "2023-07-20"
    }
  ]
};

// Initialize address autocomplete (mock implementation)
document.querySelectorAll('[data-address-autocomplete]').forEach(input => {
  // Mock implementation for demo purposes
  input.addEventListener('input', () => {
    // Simulate address suggestions
    if (input.value.length > 3) {
      // Show mock suggestions
    }
  });
});

// Real-time Price Calculation
function calculatePrice() {
  const transportPrices = {
    electric: 15,
    motor: 15,
    scooter: 20,
    bike: 20
  };
  
  const transportType = document.getElementById('transportType').value;
  const insurance = document.getElementById('insurance').value;
  
  let total = transportPrices[transportType];
  total += insurance === 'insurance' ? 10 : 0;
  
  // Update display elements
  document.getElementById('basePrice').textContent = `R${total - (insurance === 'insurance' ? 10 : 0)}`;
  document.getElementById('insuranceCost').textContent = `R${insurance === 'insurance' ? 10 : 0}`;
  document.getElementById('totalPrice').textContent = `R${total}`;
  document.getElementById('finalPrice').textContent = total;
}

// Attach event listeners for live price updates
['transportType', 'insurance'].forEach(id => {
  document.getElementById(id).addEventListener('change', calculatePrice);
});

// Initialize the price on page load
calculatePrice();

// Booking Form Submission
document.getElementById('deliveryForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!currentUser) {
    showToast('Please log in to complete your booking.', 'error');
    new bootstrap.Modal(document.getElementById('authModal')).show();
    return;
  }
  
  if (!this.checkValidity()) {
    this.classList.add('was-validated');
    return;
  }
  
  const formData = {
    pickup: document.getElementById('pickup').value,
    dropoff: document.getElementById('dropoff').value,
    transportType: document.getElementById('transportType').value,
    itemType: document.getElementById('itemType').value,
    deliveryTime: document.getElementById('deliveryTime').value,
    insurance: document.getElementById('insurance').value,
    instructions: document.getElementById('instructions').value,
    payment: document.querySelector('input[name="payment"]:checked').value,
    totalPrice: document.getElementById('finalPrice').textContent,
    userId: currentUser.id
  };
  
  try {
    const submitBtn = document.querySelector('#deliveryForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('Booking confirmed! Tracking number: #12345', 'success');
    new bootstrap.Modal(document.getElementById('bookingModal')).hide();
    loadDashboard();
  } catch (error) {
    showToast('Error processing booking. Please try again.', 'error');
  } finally {
    const submitBtn = document.querySelector('#deliveryForm button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Confirm Booking (R<span id="finalPrice">${document.getElementById('finalPrice').textContent}</span>)`;
  }
});

// Demo Login Functionality
function demoLogin() {
  currentUser = demoUser;
  updateAuthState();
  showToast('Demo login successful!', 'success');
  new bootstrap.Modal(document.getElementById('authModal')).hide();
  loadDashboard();
  loadProfile();
}

// Update Authentication State
function updateAuthState() {
  const authElements = document.querySelectorAll('.auth-state');
  authElements.forEach(el => {
    if (currentUser) {
      el.classList.remove('d-none');
      if (el.id === 'loginButton') {
        el.textContent = 'Logout';
        el.onclick = () => {
          currentUser = null;
          updateAuthState();
          showToast('Logged out successfully', 'success');
        };
      }
    } else {
      el.classList.add('d-none');
      if (el.id === 'loginButton') {
        el.textContent = 'Login / Sign Up';
        el.onclick = () => new bootstrap.Modal(document.getElementById('authModal')).show();
      }
    }
  });
  
  // Show/hide dashboard and profile sections
  document.querySelectorAll('#dashboard, #profile').forEach(el => {
    el.style.display = currentUser ? 'block' : 'none';
  });

  // Show/hide footer menu
  const footerMenu = document.getElementById('footerMenu');
  if (currentUser) {
    footerMenu.classList.remove('d-none');
  } else {
    footerMenu.classList.add('d-none');
  }
}

// Load Dashboard Data
function loadDashboard() {
  if (!currentUser) return;
  
  const tripsList = document.getElementById('tripsList');
  tripsList.innerHTML = currentUser.trips.map(trip => `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Trip #${trip.id}</h5>
        <p>Status: ${trip.status}</p>
        <p>Price: R${trip.price.toFixed(2)}</p>
        <p>Date: ${trip.date}</p>
        <p>Rating: ${trip.rating ? `${trip.rating}/5` : 'Not rated'}</p>
      </div>
    </div>
  `).join('');
}

// Load Profile Data
function loadProfile() {
  if (!currentUser) return;
  
  document.getElementById('fullName').value = currentUser.name;
  document.getElementById('email').value = currentUser.email;
  document.getElementById('paymentInfo').value = currentUser.paymentInfo;
}

// Toast Notification
function showToast(message, type) {
  const toastEl = document.getElementById('liveToast');
  const toastBody = toastEl.querySelector('.toast-body');
  toastBody.textContent = message;
  toastEl.classList.remove('bg-success', 'bg-danger');
  toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
  new bootstrap.Toast(toastEl).show();
}

// Initialize Demo Login Button
document.addEventListener('DOMContentLoaded', () => {
  const demoLoginBtn = document.createElement('button');
  demoLoginBtn.className = 'btn btn-warning ms-2';
  demoLoginBtn.textContent = 'Try Demo';
  demoLoginBtn.onclick = demoLogin;
  document.querySelector('.navbar-nav').appendChild(demoLoginBtn);
  
  updateAuthState();
});

// Add event listeners for footer menu items
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.footer-menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
