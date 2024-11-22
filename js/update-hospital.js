// Function to retrieve the token
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        hospitalId: params.get('hospitalId'),
    };
}

// Function to fetch hospital details and prefill the form
function fetchHospitalDetails(hospitalId) {
    const token = getAuthToken();

    if (!token) {
        alert('No token found. Please log in.');
        return;
    }

    fetch(`https://anteshnatsh.tryasp.net/api/Hospital/GetHospitalById/${hospitalId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch hospital details. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(hospital => {
            document.getElementById('hospitalId').value = hospital.id;
            document.getElementById('hospitalName').value = hospital.name;
            document.getElementById('hospitalAddress').value = hospital.address;
            document.getElementById('hospitalCity').value = hospital.city;
            document.getElementById('hospitalCountry').value = hospital.country;
            document.getElementById('imageURL').value = hospital.imageURL;
        })
        .catch(error => {
            console.error('Error fetching hospital details:', error);
            alert('Failed to fetch hospital details.');
        });
}

// Function to update hospital details
function updateHospital(event) {
    event.preventDefault();

    const hospitalId = document.getElementById('hospitalId').value;
    const hospitalName = document.getElementById('hospitalName').value;
    const hospitalAddress = document.getElementById('hospitalAddress').value;
    const hospitalCity = document.getElementById('hospitalCity').value;
    const hospitalCountry = document.getElementById('hospitalCountry').value;
    const imageURL = document.getElementById('imageURL').value;
    const hospitalImage = document.getElementById('hospitalImage').files[0]; // File input

    const token = getAuthToken();

    if (!token) {
        alert('No token found. Please log in.');
        return;
    }

    const formData = new FormData();
    formData.append('name', hospitalName);
    formData.append('address', hospitalAddress);
    formData.append('city', hospitalCity);
    formData.append('country', hospitalCountry);
    formData.append('imageURL', imageURL);

    if (hospitalImage) {
        formData.append('hospitalImage', hospitalImage); // Append the hospital image if available
    }

    fetch(`https://anteshnatsh.tryasp.net/api/Hospital/UpdateHospital/${hospitalId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update hospital. Status: ${response.status}`);
            }
            alert('Hospital updated successfully.');
            window.location.href = '/'; // Redirect to the main page or hospital list
        })
        .catch(error => {
            console.error('Error updating hospital:', error);
            alert('Failed to update hospital.');
        });
}

// Fetch the hospital details and prefill the form on page load
window.onload = function () {
    const { hospitalId } = getQueryParams();

    if (hospitalId) {
        fetchHospitalDetails(hospitalId);
    } else {
        alert('No hospital ID provided.');
        window.location.href = '/'; // Redirect to the main page
    }

    // Attach form submission handler
    document.getElementById('updateHospitalForm').addEventListener('submit', updateHospital);
};
