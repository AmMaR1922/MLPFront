// Function to retrieve the token (assuming it's stored in localStorage)
function getAuthToken() {
    return localStorage.getItem('authToken');  // Get token from localStorage
}

// Fetch hospitals from the API
function fetchHospitals() {
    const token = getAuthToken();
    
    if (!token) {
        console.error('No token found. Please log in.');
        return;
    }

    fetch('https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(hospitals => displayHospitals(hospitals))
    .catch(error => console.error('Error fetching hospitals:', error));
}

// Display hospitals or "No hospitals found"
function displayHospitals(hospitals) {
    const hospitalListDiv = document.getElementById('hospitalList');
    const addHospitalFormDiv = document.getElementById('addHospitalForm');

    if (hospitals.length === 0) {
        hospitalListDiv.innerHTML = '<p>No hospitals found.</p>';
    } else {
        hospitalListDiv.innerHTML = hospitals.map(hospital => `
            <div class="hospital-item">
                <p><strong>Hospital Name:</strong> ${hospital.name}</p>
                <p><strong>Address:</strong> ${hospital.address}</p>
                <p><strong>City:</strong> ${hospital.city}</p>
                <p><strong>Country:</strong> ${hospital.country}</p>
            </div>
        `).join('');
    }

    // Hide the add hospital form once we have hospitals
    addHospitalFormDiv.style.display = hospitals.length > 0 ? 'none' : 'block';
}

// Show the form to add a new hospital
function toggleAddForm() {
    const addHospitalFormDiv = document.getElementById('addHospitalForm');
    const hospitalListDiv = document.getElementById('hospitalList');
    
    if (addHospitalFormDiv.style.display === 'none') {
        addHospitalFormDiv.style.display = 'block';
        hospitalListDiv.style.display = 'none';
    } else {
        addHospitalFormDiv.style.display = 'none';
        hospitalListDiv.style.display = 'block';
    }
}

// Add a new hospital to the API with token
document.getElementById('hospitalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const hospitalData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
    };

    const token = getAuthToken();

    if (!token) {
        document.getElementById('responseMessage').textContent = 'No token found. Please log in.';
        return;
    }

    // Send POST request to add hospital
    fetch('https://anteshnatsh.tryasp.net/api/Hospital/AddHospital', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hospitalData),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').textContent = 'Hospital added successfully!';
        document.getElementById('hospitalForm').reset();
        // Refresh the list of hospitals
        fetchHospitals();
        setTimeout(() => {
            document.getElementById('responseMessage').textContent = '';  // Clear message
        }, 2000);
    })
    .catch(error => {
        console.error('Error adding hospital:', error);
        document.getElementById('responseMessage').textContent = 'Failed to add hospital.';
    });
});

// Navigate back to dashboard
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    }
}

// Fetch and display hospitals when the page loads
window.onload = function() {
    fetchHospitals();
};

// Navigate to the hospital form page
document.getElementById('addHospitalBtn').addEventListener('click', function() {
    window.location.href = 'add-hospital.html';  // Navigate to the hospital form page
});
