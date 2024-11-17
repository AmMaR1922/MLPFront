// Retrieve patient data from localStorage
const patientData = JSON.parse(localStorage.getItem('patientData'));

// Check if patient data exists in localStorage
if (patientData) {
    const patientInfoDiv = document.getElementById('patientInfo');
    
    // Display patient data
    patientInfoDiv.innerHTML = `
        <p><strong>Name:</strong> ${patientData.name}</p>
        <p><strong>Phone Number:</strong> ${patientData.phoneNumber}</p>
        <p><strong>Address:</strong> ${patientData.address}</p>
        <p><strong>Sex:</strong> ${patientData.sex}</p>
        <p><strong>Pregnant:</strong> ${patientData.pregnant || 'N/A'}</p>
        <p><strong>Number of Births:</strong> ${patientData.numberOfBirths || 'N/A'}</p>
    `;
} else {
    // Display message if no patient data found
    document.getElementById('patientInfo').innerHTML = '<p>No patient data available.</p>';
}
