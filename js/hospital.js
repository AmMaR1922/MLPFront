// Display hospitals if any, otherwise show a "No hospitals found" message
function displayHospitals() {
    const hospitalList = JSON.parse(localStorage.getItem('hospitals')) || [];
    const hospitalListDiv = document.getElementById('hospitalList');
    const addHospitalFormDiv = document.getElementById('addHospitalForm');

    if (hospitalList.length === 0) {
        hospitalListDiv.innerHTML = '<p>No hospitals found.</p>';
    } else {
        hospitalListDiv.innerHTML = hospitalList.map(hospital => `
            <div class="hospital-item">
                <p><strong>Hospital Name:</strong> ${hospital.name}</p>
                <p><strong>Address:</strong> ${hospital.address}</p>
                <p><strong>City:</strong> ${hospital.city}</p>
                <p><strong>Country:</strong> ${hospital.country}</p>
            </div>
        `).join('');
    }

    // Hide the add hospital form once we have hospitals
    addHospitalFormDiv.style.display = hospitalList.length > 0 ? 'none' : 'block';
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

// Save new hospital data to localStorage
document.getElementById('hospitalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const hospitalData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
    };

    const hospitalList = JSON.parse(localStorage.getItem('hospitals')) || [];
    hospitalList.push(hospitalData);
    localStorage.setItem('hospitals', JSON.stringify(hospitalList));

    document.getElementById('responseMessage').textContent = 'Hospital added successfully!';
    document.getElementById('hospitalForm').reset();

    // Update hospital list and hide form again
    displayHospitals();
    setTimeout(() => {
        document.getElementById('responseMessage').textContent = '';  // Clear message
    }, 2000);
});

// Display hospitals when the page loads
displayHospitals();

// Navigate back to dashboard
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    }
}
