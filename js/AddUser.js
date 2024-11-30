
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('auth_token'); // Assuming token for authentication (optional)
    const apiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';  // Replace with your API URL

    // Fetch hospitals data
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch hospitals');
        }
        return response.json();
    })
    .then(data => {
        // Assuming the API returns an array of hospital objects
        const hospitalSelect = document.getElementById('hospitalId');

        // Clear any existing options
        hospitalSelect.innerHTML = '<option value="">Select a Hospital</option>';

        // Populate the dropdown with hospital options
        data.forEach(hospital => {
            const option = document.createElement('option');
            option.value = hospital.id; // hospital ID for value
            option.textContent = hospital.name; // hospital name for display
            hospitalSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching hospitals:', error);
        alert('Failed to load hospitals.');
    });
});

// Handle form submission
document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Retrieve form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const hospitalId = document.getElementById('hospitalId').value;

    // Ensure hospitalId is not empty and parse as an integer
    if (!hospitalId) {
        alert("Please select a hospital.");
        return;
    }

    // Create the user data object
    const userData = {
        username: username,
        password: password,
        email: email,
        phoneNumber: phoneNumber,
        hospitalId: parseInt(hospitalId, 10)  // Ensure it's an integer
    };

    // Make a POST request to the createuser API
    const createUserUrl = 'https://anteshnatsh.tryasp.net/api/Account/CreateUser';  // Your API URL for creating user
    
    fetch(createUserUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Assuming token for authentication (optional)
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData) // Sending the user data as JSON
    })
    .then(response => {
        if (!response.ok) {
            if(response.status == 500)
                {throw new Error('Hospital has an admin already');}
            
            throw new Error('Failed to create user');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response from the API (if successful)
        console.log('User created successfully:', data);
        alert('User added successfully!');
        
        // Reload the page after success
        location.reload();  // This will reload the current page
        
        // Optionally, reset the form
        document.getElementById('addUserForm').reset();
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert(error);
    });
});