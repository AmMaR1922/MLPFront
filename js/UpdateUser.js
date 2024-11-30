document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('updateUser'));

    if (userData) {
        // Populate the form fields with user data
        document.getElementById('username').value = userData.username;
        document.getElementById('email').value = userData.email;
        document.getElementById('phoneNumber').value = userData.phoneNumber;

        // Populate the hospital dropdown (you may fetch these dynamically from your API)
        const hospitalSelect = document.getElementById('hospitalId');
        fetch('https://anteshnatsh.tryasp.net/api/hospitals', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(hospitals => {
            hospitals.forEach(hospital => {
                const option = document.createElement('option');
                option.value = hospital.id;
                option.textContent = hospital.name;
                if (hospital.name === userData.hospitalName) {
                    option.selected = true;
                }
                hospitalSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching hospitals:', error));
    } else {
        alert('No user data found to update.');
        window.location.href = 'AllUsers.html';
    }

    // Handle form submission
    document.getElementById('addUserForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Collect updated data from the form
        const updatedData = {
            id: userData.id,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            hospitalId: document.getElementById('hospitalId').value
        };

        // Send updated data to the server
        fetch(`https://anteshnatsh.tryasp.net/api/account/update/${userData.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (response.ok) {
                alert('User updated successfully!');
                window.location.href = 'AllUsers.html'; // Redirect to AllUsers page
            } else {
                alert('Failed to update user.');
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('An error occurred while updating the user.');
        });
    });
});
