// Function to retrieve the token (assuming it's stored in localStorage)
function getAuthToken() {
    return localStorage.getItem('auth_token');  // Get token from localStorage
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
                <img id="currentImagePreview" src="${hospital.imageURL}" alt="Hospital Image" style =  
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

// document.querySelectorAll('.showModal').forEach(button => {
//     button.addEventListener('click', function() {
//         const hospitalId = this.getAttribute('data-hospital-id');
//         openModal(hospitalId);
//     });
// });






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












//******************* ADD Hospital ************************

document.getElementById('hospitalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve form elements
    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const imageFile = document.getElementById('fileUpload').files[0]; // File from input

    // Validate fields are not empty
    if (!name || !address || !city || !country || !imageFile) {
        document.getElementById('responseMessage').textContent = 'Please fill in all required fields, including the image.';
        return;
    }

    // Create FormData object to include the image and text fields
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('hospitalImage', imageFile); // Append the file

    // Get authentication token
    const token = getAuthToken();

    if (!token) {
        document.getElementById('responseMessage').textContent = 'No token found. Please log in.';
        return;
    }

    // Send POST request to add hospital
    fetch('https://anteshnatsh.tryasp.net/api/Hospital/AddHospital', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Authorization header
        },
        body: formData, // FormData object
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

        location.reload(true);
    })
    .catch(error => {
        console.error('Error adding hospital:', error);
        document.getElementById('responseMessage').textContent = `Failed to add hospital: ${error.message}`;
    });
});











//Delete a hospital 

//Modal 


// cancel.addEventListener("click", ()=>{
//     modal.classList.remove("active");
// })

// showModal.addEventListener("click", ()=>{
//     modal.classList.add("active");
// })

// confirmDelete.addEventListener("click", () => {
//     if (hospitalIdToDelete !== null) {
//         deleteHospital(hospitalIdToDelete);
//         modal.classList.remove("active");
//     }
// });
//  function openModal(hospitalId) {
//      hospitalIdToDelete = hospitalId; // Store the ID for deletion
//      modal.classList.add("active");
// }




// document.addEventListener("DOMContentLoaded", function () {
//     // Ensure all the DOM elements exist before proceeding
//     const modal = document.getElementById("modal");
//     const cancel = document.getElementById("cancel");
//     const confirmDelete = document.getElementById("confirmDelete");

//     if (!modal || !cancel || !confirmDelete) {
//         console.error("Some DOM elements are missing. Ensure modal, cancel, and confirmDelete are present in the HTML.");
//         return;
//     }

//     let hospitalIdToDelete = null;

//     // Event listener for the cancel button (to close the modal)
//     cancel.addEventListener("click", () => {
//         modal.classList.remove("active");
//         hospitalIdToDelete = null; // Reset the hospital ID when cancelling
//     });

//     // Event listener for the confirm delete button
//     confirmDelete.addEventListener("click", () => {
//         if (hospitalIdToDelete !== null) {
//             try {
//                 deleteHospital(hospitalIdToDelete);  // Call the delete function with the stored ID
//                 modal.classList.remove("active"); // Close the modal after deletion
//             } catch (error) {
//                 console.error("Error deleting the hospital: ", error);
//             }
//         } else {
//             console.warn("No hospital ID selected for deletion.");
//         }
//     });


//     // Event listener for all delete buttons
//     document.querySelectorAll('.showModal').forEach((button) => {
//         button.addEventListener("click", function() {
//             const hospitalId = this.getAttribute('onclick').match(/\d+/)[0]; // Extract hospital ID from the onclick attribute
//             openModal(hospitalId);
//         });
//     });

//     function openModal(hospitalId) {
//         if (!hospitalId) {
//             console.error("Invalid hospital ID passed to openModal");
//             return;
//         }
//         hospitalIdToDelete = hospitalId; // Store the ID for deletion
//         modal.classList.add("active");
//     }
// });

// Define the openModal function first
function openModal(hospitalId) {
    const modal = document.getElementById("modal");
    if (!modal) {
        console.error("Modal element not found.");
        return;
    }

    // Store the hospitalId to be deleted later
    let hospitalIdToDelete = hospitalId;

    // Open the modal when the delete button is clicked
    modal.classList.add("active");

    // Event listener for the cancel button (to close the modal)
    document.getElementById("cancel").addEventListener("click", () => {
        modal.classList.remove("active");
        hospitalIdToDelete = null; // Reset hospitalId when cancel is clicked
    });

    // Event listener for the confirm delete button
    document.getElementById("confirmDelete").addEventListener("click", () => {
        if (hospitalIdToDelete !== null) {
            deleteHospital(hospitalIdToDelete);
            modal.classList.remove("active"); // Close modal after deletion
        } else {
            console.warn("No hospital ID selected for deletion.");
        }
    });
}

// Attach the event listeners to the delete buttons
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.showModal').forEach(button => {
        button.addEventListener('click', function () {
            const hospitalId = this.getAttribute('data-hospital-id');
            openModal(hospitalId);
        });
    });
});








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
//         const imageFile = document.getElementById('UpdateFileUpload').files[0];
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















function updateHospital(id) {
    const hospitalRow = document.getElementById(`hospital-${id}`);
    const hospitalData = {
        id: id,
        name: hospitalRow.cells[1].textContent,
        address: hospitalRow.cells[2].textContent,
        city: hospitalRow.cells[3].textContent,
        country: hospitalRow.cells[4].textContent,
        imageURL: hospitalRow.cells[0].textContent, // Assuming Image URL is in cell 0
    };

    // Pre-fill the form with hospital data
    document.getElementById('updateName').value = hospitalData.name;
    document.getElementById('updateAddress').value = hospitalData.address;
    document.getElementById('updateCity').value = hospitalData.city;
    document.getElementById('updateCountry').value = hospitalData.country;
    document.getElementById('currentImagePreview').src = hospitalData.imageURL;

    // Show the update form and hide the hospital table
    document.getElementById('updateHospitalForm').style.display = 'block';
    document.getElementById('hospitalTable').style.display = 'none';

    // Handle form submission for update
    document.getElementById('updateHospitalFormDetails').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get updated form data
        const updatedData = {
            id: id,
            name: document.getElementById('updateName').value.trim(),
            address: document.getElementById('updateAddress').value.trim(),
            city: document.getElementById('updateCity').value.trim(),
            country: document.getElementById('updateCountry').value.trim(),
        };

        // Validate the required fields
        if (!updatedData.name || !updatedData.address || !updatedData.city || !updatedData.country) {
            document.getElementById('responseMessage').textContent = 'Please fill in all required fields.';
            return;
        }

        // If an image is uploaded, get the file
        const imageFile = document.getElementById('UpdateFileUpload').files[0];
        if (imageFile) {
            // Handle image file upload (e.g., using FormData)
            const formData = new FormData();
            formData.append('name', updatedData.name);
            formData.append('address', updatedData.address);
            formData.append('city', updatedData.city);
            formData.append('country', updatedData.country);
            formData.append('hospitalImage', imageFile); // Append the file

            // Get the authentication token
            const token = getAuthToken();

            if (!token) {
                document.getElementById('responseMessage').textContent = 'No token found. Please log in.';
                return;
            }

            // Send PUT request to update hospital
            fetch(`https://anteshnatsh.tryasp.net/api/Hospital/UpdateHospital/${id}`, {
                method: 'POST', // You might need to change this to PUT based on your API
                headers: {
                    'Authorization': `Bearer ${token}`,  // Add Authorization header
                },
                body: formData, // Send FormData which includes both text fields and image
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                document.getElementById('responseMessage').textContent = 'Hospital updated successfully!';

                // Hide the update form and show the hospital list
                document.getElementById('updateHospitalForm').style.display = 'none';
                document.getElementById('hospitalTable').style.display = 'block';

                // Optionally refresh the hospital list
                fetchHospitals();

                // Clear the success message after 2 seconds
                setTimeout(() => {
                    document.getElementById('responseMessage').textContent = '';
                }, 2000);

                // Optionally reload the page to reflect changes
                location.reload(true);
            })
            .catch(error => {
                console.error('Error updating hospital:', error);
                document.getElementById('responseMessage').textContent = `Failed to update hospital: ${error.message}`;
            });

        } else {
            // No new image, use the existing one
            updatedData.imageURL = hospitalData.imageURL;

            // Send data without file upload (if image is unchanged)
            sendUpdateRequest(id, updatedData);
        }
    });
}

// Helper function to send data without file upload (if image is unchanged)
function sendUpdateRequest(id, updatedData) {
    const token = getAuthToken();

    if (!token) {
        document.getElementById('responseMessage').textContent = 'No token found. Please log in.';
        return;
    }

    // Send PUT request to update the hospital data
    fetch(`https://anteshnatsh.tryasp.net/api/Hospital/UpdateHospital/${id}`, {
        method: 'POST',  // You might need to change this to PUT based on your API
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),  // Send JSON data without file
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').textContent = 'Hospital updated successfully!';
        
        // Hide the form and show the hospital table
        document.getElementById('updateHospitalForm').style.display = 'none';
        document.getElementById('hospitalTable').style.display = 'block';

        // Refresh the hospital list
        fetchHospitals();

        // Clear success message after 2 seconds
        setTimeout(() => {
            document.getElementById('responseMessage').textContent = '';
        }, 2000);

       // location.reload(true);  // Optionally reload to reflect changes
    })
    .catch(error => {
        console.error('Error updating hospital:', error);
        document.getElementById('responseMessage').textContent = `Failed to update hospital: ${error.message}`;
    });
}
