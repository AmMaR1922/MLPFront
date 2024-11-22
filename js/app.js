// Update user information
function updateUserInfo() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
        const { username, hospitalName } = JSON.parse(userData);
        document.getElementById('username').textContent = username;
        document.getElementById('hospitalNameHeader').textContent = hospitalName;
    } else {
        window.location.href = 'index.html';
    }
}

// Navigation function
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Update copyright year
function updateCopyright() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize the dashboard
function initDashboard() {
    updateUserInfo();
    updateCopyright();
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);