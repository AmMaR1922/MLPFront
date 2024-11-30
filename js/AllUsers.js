document.addEventListener('DOMContentLoaded', function () {
    const usersTableBody = document.getElementById('usersTableBody');

    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('auth_token');  // Ensure your token is stored in localStorage

    // If the token is not available, display an error or prevent the request
    if (!token) {
        alert('You are not logged in. Please log in first.');
        return;
    }

    // API URL (change this to your actual API endpoint)
    const apiUrl = 'https://anteshnatsh.tryasp.net/api/account/getallusers'; 

    // Make the request to fetch user data as soon as the page loads
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Send the token as part of the Authorization header
            'Content-Type': 'application/json'   // Optional, depending on the API
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        // Clear any existing data
        usersTableBody.innerHTML = '';

        // Check if data is available
        if (data && data.length > 0) {
            data.forEach(user => {
                const row = document.createElement('tr');

                const usernameCell = document.createElement('td');
                usernameCell.textContent = user.username;

                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;

                const hospitalCell = document.createElement('td');
                hospitalCell.textContent = user.hospitalName;

                // Create the action buttons (Update and Delete)
                const actionsCell = document.createElement('td');

                const updateButton = document.createElement('button');
                updateButton.classList.add('btn-update');
                updateButton.textContent = 'Update';
                updateButton.addEventListener('click', function () {
                    handleUpdateUser(user.id);  // You can pass user.id or any other identifier
                });

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn-delete');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    handleDeleteUser(user.email);  // Pass the user id to the delete function
                });

                actionsCell.appendChild(updateButton);
                actionsCell.appendChild(deleteButton);

                // Append all cells to the row
                row.appendChild(usernameCell);
                row.appendChild(emailCell);
                row.appendChild(hospitalCell);
                row.appendChild(actionsCell);

                // Append the row to the table body
                usersTableBody.appendChild(row);
            });
        } else {
            alert('No users found.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to load users. Please try again later.');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addUserButton = document.getElementById('AddUser');

    // Redirect to adduser.html when the button is clicked
    addUserButton.addEventListener('click', function() {
        window.location.href = 'adduser.html';  // This will navigate to the adduser.html page
    });

    // Add the rest of your existing code if needed (like fetching users, etc.)
});

// Handle the Update User action
function handleUpdateUser(userId) {
    console.log('Updating user with ID:', userId);
    // Redirect to the update page (you could pass the user ID as a query param, or open a modal)
    window.location.href = `updateuser.html?id=${userId}`;  // Example of passing userId to updateuser.html
}

// Handle the Delete User action
function handleDeleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        // If user confirms, send a DELETE request to the API to remove the user
        const token = localStorage.getItem('auth_token');
        const apiUrl = `https://anteshnatsh.tryasp.net/api/account/delete/${email}`;

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                alert('User deleted successfully');
                // Reload the page to reflect the changes
                location.reload();
            } else {
                alert('Failed to delete user');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('An error occurred while trying to delete the user.');
        });
    }
}
