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
            'Authorization': `Bearer ${token}`,  // Fixed template literal
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
        hospitalListDiv.innerHTML = '<tr><td colspan="5">No hospitals found.</td></tr>';
    } else {
        hospitalListDiv.innerHTML = hospitals.map(hospital => 
            // <td>${hospital.ImageURL}</td>
            `<tr id="hospital-${hospital.id}">
            <td>
                <img id="currentImagePreview" src="https://www.w3schools.com/howto/img_avatar.png" alt="Hospital Image" style =  
                "    
                    max-width: 60px; 
                    max-height: 60px;
                    border-radius: 50%;
                    object-fit: cover; 
                    vertical-align: middle;
                    margin-right: 10px;
                    " 
                >
                </td>
                <td>${hospital.name}</td>
                <td>${hospital.address}</td>
                <td>${hospital.city}</td>
                <td>${hospital.country}</td>
                <td>
                    <button class="btn-action btn-update" onclick="updateHospital(${hospital.id})">Update</button>
                    <button class="btn-action btn-delete" onclick="deleteHospital(${hospital.id})">Delete</button>
                </td>
            </tr>`
        ).join('');
    }
}






// Show the form to add a new hospital
document.getElementById('addHospitalBtn').addEventListener('click', function() {
    document.getElementById('addHospitalForm').style.display = 'block';
    document.getElementById('addHospitalBtn').style.display = 'none';

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
        country: document.getElementById('country').value.trim(),
        ImageURL: document.getElementById('fileUpload').value.trim()
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
            'Authorization': `Bearer ${token}`,  // Fixed template literal
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
        document.getElementById('addHospitalBtn').style.display = 'none';
        document.getElementById('hospitalTable').style.display = 'block';

        // Refresh the hospital list
        fetchHospitals();

        // Clear the success message after 2 seconds
        setTimeout(() => {
            document.getElementById('responseMessage').textContent = '';  
        }, 2000);

        location.reload(true);

    })
    .catch(error => {
        console.error('Error adding hospital:', error);
        document.getElementById('responseMessage').textContent = `Failed to add hospital: ${error.message}`;
    });
});










//Delete a hospital
function deleteHospital(id) {
    const token = getAuthToken();

    if (!token) {
        document.getElementById('responseMessage').textContent = 'No token found. Please log in.';
        return;
    }

    fetch(`https://anteshnatsh.tryasp.net/api/Hospital/DeleteHospital/${id}`, {  // Fixed template literal
        method: 'POST',  
        headers: {
            'Authorization': `Bearer ${token}`,  // Fixed template literal
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Failed to delete hospital. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
            });
        }
        location.reload(true);

        return response.json();
    })
    .then(data => {
        // Show success message
        document.getElementById('responseMessage').textContent = 'Hospital deleted successfully!';


        // Remove the row from the table directly
        const row = deleteButton.closest('tr');
        row.remove();

        // Refresh the hospital list immediately after deletion
        //fetchHospitals();
        
        // Clear the success message after 2 seconds
        setTimeout(() => {
            document.getElementById('responseMessage').textContent = '';  
        }, 2000);
        // setTimeout(() => {
        //     location.reload(true);  // Reload the page after 2 seconds
        // }, 2000);

    })
    .catch(error => {
        console.error('Error deleting hospital:', error);
        document.getElementById('responseMessage').textContent = `Failed to delete hospital: ${error.message}`;
    });
}




























// Update a hospital
// Update a hospital using id and updated data (Dt object)
// Update a hospital using id and updated data (Dt object)
function updateHospital(id) {
    // Fetch the hospital details from the list or via API call to pre-fill the form
    const hospitalRow = document.getElementById(`hospital-${id}`);
    const hospitalData = {
        
        ImageURL: hospitalRow.cells[0].textContent,

        id : id,
        name: hospitalRow.cells[1].textContent,
        address: hospitalRow.cells[2].textContent,
        city: hospitalRow.cells[3].textContent,
        country: hospitalRow.cells[4].textContent,
    };

    // Pre-fill the form with the hospital data
    document.getElementById('updateName').value = hospitalData.name;
    document.getElementById('updateAddress').value = hospitalData.address;
    document.getElementById('updateCity').value = hospitalData.city;
    document.getElementById('updateCountry').value = hospitalData.country;
    document.getElementById('currentImagePreview').value = "";
    

    // Show the update form and hide the hospital table
    document.getElementById('updateHospitalForm').style.display = 'block';
    document.getElementById('addHospitalBtn').style.display = 'none';
    document.getElementById('hospitalTable').style.display = 'none';

    // Handle the form submission for updating
    document.getElementById('updateHospitalFormDetails').onsubmit = function(event) {
        event.preventDefault();

        // Get updated data from the form
        const updatedData = {
            id : id,
            name: document.getElementById('updateName').value.trim(),
            address: document.getElementById('updateAddress').value.trim(),
            city: document.getElementById('updateCity').value.trim(),
            country: document.getElementById('updateCountry').value.trim(),
            ImageURL: document.getElementById('UpdateFileUpload').value.trim()
        };

        
        // Call the update hospital function
        sendUpdateRequest(id, updatedData);
    };
}

// Function to send the PUT request to update the hospital
function sendUpdateRequest(id, updatedData) {
    const token = getAuthToken();

    if (!token) {
        document.getElementById('responseMessage').textContent = 'No token found. Please log in.';
        return;
    }

    // Validate the updated data
    if (!updatedData.name || !updatedData.address || !updatedData.city || !updatedData.country) {
        document.getElementById('responseMessage').textContent = 'Please fill in all required fields: Name, Address, City, and Country.';
        return;
    }

    // Send PUT request to update the hospital with provided data
    fetch(`https://anteshnatsh.tryasp.net/api/Hospital/UpdateHospital/${id}`, {
        method: 'POST', // Using PUT instead of POST for updating
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Failed to update hospital. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        document.getElementById('responseMessage').textContent = 'Hospital updated successfully!';

        // Hide the update form and show the hospital list
        document.getElementById('updateHospitalForm').style.display = 'none';
        document.getElementById('hospitalTable').style.display = 'block';

        location.reload(true);
        // Refresh the hospital list
        fetchHospitals();

        // Clear the success message after 2 seconds
        setTimeout(() => {
            document.getElementById('responseMessage').textContent = '';  
        }, 2000);
    })
    .catch(error => {
        console.error('Error updating hospital:', error);
        document.getElementById('responseMessage').textContent = `Failed to update hospital: ${error.message}`;
    });
}



// Fetch hospitals on page load
window.onload = function() {
    fetchHospitals();
};






// function updateHospital(id) {
//     const hospitalRow = document.getElementById(`hospital-${id}`);
//     const hospitalData = {
//         id: id,
//         name: hospitalRow.cells[1].textContent,
//         address: hospitalRow.cells[2].textContent,
//         city: hospitalRow.cells[3].textContent,
//         country: hospitalRow.cells[4].textContent,
//         imageURL: hospitalRow.cells[0].textContent, // Assuming Image URL is in cell 0
//     };

//     // Pre-fill the form with hospital data
//     document.getElementById('updateName').value = hospitalData.name;
//     document.getElementById('updateAddress').value = hospitalData.address;
//     document.getElementById('updateCity').value = hospitalData.city;
//     document.getElementById('updateCountry').value = hospitalData.country;
//     document.getElementById('currentImagePreview').src = hospitalData.imageURL;

//     // Show the update form
//     document.getElementById('updateHospitalForm').style.display = 'block';
//     document.getElementById('hospitalTable').style.display = 'none';

//     // Handle form submission for update
//     document.getElementById('updateHospitalFormDetails').onsubmit = function(event) {
//         event.preventDefault();

//         // Get updated form data
//         const updatedData = {
//             id: id,
//             name: document.getElementById('updateName').value.trim(),
//             address: document.getElementById('updateAddress').value.trim(),
//             city: document.getElementById('updateCity').value.trim(),
//             country: document.getElementById('updateCountry').value.trim(),
//         };

//         // If an image is uploaded, get the file
//         const imageFile = document.getElementById('updateImage').files[0];
//         if (imageFile) {
//             // Handle image file upload (e.g., convert to Base64 or upload to the server)
//             uploadImage(imageFile)
//                 .then(imageURL => {
//                     updatedData.imageURL = imageURL;
//                     sendUpdateRequest(id, updatedData);
//                 })
//                 .catch(error => console.error('Image upload failed:', error));
//         } else {
//             // No new image, use the existing one
//             updatedData.imageURL = hospitalData.imageURL;
//             sendUpdateRequest(id, updatedData);
//         }
//     };
// }
