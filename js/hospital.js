








// Function to retrieve the token (assuming it's stored in localStorage)
function getAuthToken() {
    return localStorage.getItem('auth_token'); // Get token from localStorage
}

// Fetch hospitals from the API
function fetchHospitals() {
    const token = getAuthToken();

    if (!token) {
        console.error('No token found. Please log in.');
        document.getElementById('hospitalList').innerHTML = '<tr><td colspan="6">No token found. Please log in.</td></tr>';
        return;
    }

    fetch('https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch hospitals. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(hospitals => displayHospitals(hospitals))
        .catch(error => {
            console.error('Error fetching hospitals:', error);
            document.getElementById('hospitalList').innerHTML = '<tr><td colspan="6">Error fetching hospitals.</td></tr>';
        });
}

// Display hospitals in the table
function displayHospitals(hospitals) {
    const hospitalListDiv = document.getElementById('hospitalList');

    if (hospitals.length === 0) {
        hospitalListDiv.innerHTML = '<tr><td colspan="6">No hospitals found.</td></tr>';
    } else {
        hospitalListDiv.innerHTML = hospitals.map((hospital, index) => `
            <tr id="hospital-${hospital.id}">
                <td>
                    <img src="${hospital.imageURL}" alt="Hospital Image" style="
                        max-width: 60px;
                        max-height: 60px;
                        border-radius: 50%;
                        overflow: hidden; 
                        object-fit: cover;
                        vertical-align: middle;
                        margin-right: 10px;
                        ">
                </td>
                <td>${hospital.name}</td>
                <td>${hospital.address}</td>
                <td>${hospital.city}</td>
                <td>${hospital.country}</td>
                <td>
                    <button data-key="UpdateHospitalButton" class="btn-update localizable-button" onclick="updateHospital('${hospital.id}')">Update</button>
                    <button data-key="DeleteHospitalButton" class="btn-action localizable-button" onclick="showConfirmationModal('delete', '${hospital.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
        
    }
    changeLanguage();

    
}

// Show the confirmation modal
function showConfirmationModal(actionType, hospitalId) {
    const modal = document.getElementById('confirmationModal');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmBtn = document.getElementById('confirmActionBtn');
    const cancelBtn = document.getElementById('cancelActionBtn');

    // Set the appropriate message based on the action type
    if (actionType === 'delete') {
        confirmationMessage.textContent = 'Are you sure you want to delete this hospital?';
    } else if (actionType === 'update') {
        confirmationMessage.textContent = 'Are you sure you want to update this hospital?';
    }

    // Display the modal
    modal.style.display = 'flex';

    // Handle the confirm button click
    confirmBtn.onclick = function() {
        if (actionType === 'delete') {
            deleteHospital(hospitalId); // Call delete function
        } else if (actionType === 'update') {
            updateHospital(hospitalId); // Call update function
        }
        modal.style.display = 'none'; // Close the modal
    };

    // Handle the cancel button click
    cancelBtn.onclick = function() {
        modal.style.display = 'none'; // Close the modal
    };
}

// Function to handle updating a hospital
function updateHospital(hospitalId) {
    // Redirect to the update page with the hospitalId as a query parameter
    window.location.href = `update-hospital.html?hospitalId=${hospitalId}`;
}

// Function to handle deleting a hospital
function deleteHospital(hospitalId) {
    const token = getAuthToken();

    fetch(`https://anteshnatsh.tryasp.net/api/Hospital/DeleteHospital/${hospitalId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete hospital. Status: ${response.status}`);
            }
            alert('Hospital deleted successfully.');
            fetchHospitals(); // Reload the table after deletion
        })
        .catch(error => {
            console.error('Error deleting hospital:', error);
            alert('Failed to delete hospital.');
        });
}

// Fetch hospitals on page load
window.onload = function () {
    fetchHospitals();
};

