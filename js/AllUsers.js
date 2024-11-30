document.addEventListener('DOMContentLoaded', function () {
    const usersTableBody = document.getElementById('usersTableBody');

    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('auth_token');

    // If the token is not available, display an error or prevent the request
    if (!token) {
        alert('You are not logged in. Please log in first.');
        return;
    }

    // API URL (change this to your actual API endpoint)
    const apiUrl = 'https://anteshnatsh.tryasp.net/api/account/getallusers';

    // Fetch user data as soon as the page loads
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            // Clear any existing data
            usersTableBody.innerHTML = '';

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

                    // const updateButton = document.createElement('button');
                    // updateButton.classList.add('btn-update');
                    // updateButton.textContent = 'Update';
                    // updateButton.addEventListener('click', function () {
                    //     handleUpdateUser(user.id, user);
                    // });

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('btn-delete');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function () {
                        handleDeleteUser(user.email);
                    });

                    // actionsCell.appendChild(updateButton);
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

// Handle the Add User button
document.addEventListener('DOMContentLoaded', function () {
    const addUserButton = document.getElementById('AddUser');
    addUserButton.addEventListener('click', function () {
        window.location.href = 'adduser.html';
    });
});

// // Handle the Update User action
// function handleUpdateUser(userId, userData) {
//     console.log('Updating user with ID:', userId);
//     // Pass user data to the UpdateUser page via localStorage or query params
//     localStorage.setItem('updateUserData', JSON.stringify(userData));
//     window.location.href = `updateuser.html?id=${userId}`;
// }

// Handle the Delete User action with a modal confirmation
let userToDelete = null;

function handleDeleteUser(email) {
    userToDelete = email;

    // Show the modal
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';

    // Handle the confirm button click
    document.getElementById('confirmDelete').onclick = function () {
        deleteUser(email);
        modal.style.display = 'none'; // Hide the modal after deletion
    };

    // Handle the cancel button click
    document.getElementById('cancelDelete').onclick = function () {
        modal.style.display = 'none'; // Just hide the modal
    };
}

// Function to send the delete request
function deleteUser(email) {
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
                location.reload(); // Reload the page to reflect changes
            } else {
                alert('Failed to delete user');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('An error occurred while trying to delete the user.');
        });
}
