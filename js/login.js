document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://anteshnatsh.tryasp.net/api/Account/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password }) // Assuming `username` is used as email
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid credentials');
        }

        const data = await response.json();

        // Save the token to localStorage
        localStorage.setItem('authToken', data.token);

        // Redirect to the dashboard after successful login
        window.location.href = 'dashboard.html';
    } catch (error) {
        document.getElementById('error-message').innerText = error.message;
    }
});
