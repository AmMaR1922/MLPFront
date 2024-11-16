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

// Display hospitals in the table
function displayHospitals(hospitals) {
    const hospitalListDiv = document.getElementById('hospitalList');

    if (hospitals.length === 0) {
        hospitalListDiv.innerHTML = '<tr><td colspan="4">No hospitals found.</td></tr>';
    } else {
        hospitalListDiv.innerHTML = hospitals.map(hospital => `
            <tr>
                <td>${hospital.name}</td>
                <td>${hospital.address}</td>
                <td>${hospital.city}</td>
                <td>${hospital.country}</td>
            </tr>
        `).join('');
    }
}

// Show the form to add a new hospital
document.getElementById('addHospitalBtn').addEventListener('click', function() {
    document.getElementById('addHospitalForm').style.display = 'block';
    document.getElementById('hospitalTable').style.display = 'none';
});

// Close the add hospital form
document.getElementById('closeFormBtn').addEventListener('click', function() {
    document.getElementById('addHospitalForm').style.display = 'none';
    document.getElementById('hospitalTable').style.display = 'block';
});

// Add a new hospital to the API
document.getElementById('hospitalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const hospitalData = {
        name: document.getElementById('name').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        country: document.getElementById('country').value.trim()
    };

    // Log hospital data for debugging
    console.log('Hospital Data:', hospitalData);

    // Validate the fields are not empty
    if (!hospitalData.name || !hospitalData.address || !hospitalData.city || !hospitalData.country) {
        document.getElementById('responseMessage').textContent = 'Please fill in all required fields: Name, Address, City, and Country.';
        return;
    }

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
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Failed to save hospital. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        document.getElementById('responseMessage').textContent = 'Hospital added successfully!';
        
        // Reset the form
        document.getElementById('hospitalForm').reset();

        // Hide the form and show the hospital list
        document.getElementById('addHospitalForm').style.display = 'none';
        document.getElementById('hospitalTable').style.display = 'block';

        // Refresh the hospital list
        fetchHospitals();

        // Clear the success message after 2 seconds
        setTimeout(() => {
            document.getElementById('responseMessage').textContent = '';  
        }, 2000);
    })
    .catch(error => {
        console.error('Error adding hospital:', error);
        document.getElementById('responseMessage').textContent = `Failed to add hospital: ${error.message}`;
    });
});

// Fetch and display hospitals when the page loads
window.onload = function() {
    fetchHospitals();
};
