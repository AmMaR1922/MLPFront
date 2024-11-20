const API_URL = 'https://anteshnatsh.tryasp.net/api';

async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_URL}/Account/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to login');
        }

        const data = await response.json();
        localStorage.setItem('user_data', JSON.stringify(data));
        localStorage.setItem('auth_token', data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function handleLogout() {
    localStorage.clear();
    window.location.href = 'index.html';
}