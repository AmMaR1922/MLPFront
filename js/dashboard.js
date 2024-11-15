 

// Function to navigate between pages
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    } else if (page === 'patient') {
        window.location.href = 'patient.html';
    } else if (page === 'hospital') {
        window.location.href = 'hospital.html';
    } else if (page === 'biological') {
        window.location.href = 'biological.html';
    }
}
