document.getElementById('hospitalForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Retrieve form data
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const imageFile = document.getElementById('fileUpload').files[0];

    // Validate fields
    if (!name || !address || !city || !country || !imageFile) {
        document.getElementById('responseMessage').textContent = 'Please fill in all required fields.';
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('hospitalImage', imageFile);

    // Mock function to get token
    const token = getAuthToken();
    if (!token) {
        document.getElementById('responseMessage').textContent = 'No authentication token found. Please log in.';
        return;
    }

    // Send POST request to the API
    fetch('https://anteshnatsh.tryasp.net/api/Hospital/AddHospital', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(`Failed to save hospital: ${JSON.stringify(error)}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // Success message
            document.getElementById('responseMessage').style.color = 'green';
            document.getElementById('responseMessage').textContent = 'Hospital added successfully!';
            document.getElementById('hospitalForm').reset();

            // Optionally redirect to the list page after a short delay
            setTimeout(() => {
                window.location.href = 'hospital.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('responseMessage').textContent = `Error: ${error.message}`;
        });
});

// Mock function to get authentication token
function getAuthToken() {
    return  localStorage.getItem('auth_token'); // Replace with actual token retrieval logic
}
