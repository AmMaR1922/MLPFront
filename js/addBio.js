// Extract patient ID from the URL
function getPatientIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('patientId');
}

const patientId = getPatientIdFromUrl(); // Get patient ID from URL
const token = localStorage.getItem('auth_token'); // Get auth token from localStorage
const addBioApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AddBio/';

// Set patient ID in hidden input
document.getElementById('patientId').value = patientId;

// Handle form submission
document.getElementById('bioForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const healthCondition = ""; // Default value as 'string'
    const sugarPercentage = parseFloat(document.getElementById('sugarPercentage').value) || 0;
    const bloodPressure = parseFloat(document.getElementById('bloodPressure').value) || 0;
    const averageTemperature = parseFloat(document.getElementById('averageTemperature').value) || 0;
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0]; // Default to today's date
    const time = document.getElementById('time').value || "string"; // Default value as 'string'

    const bioData = {
        id: 0, // Default to 0
        healthConditionScore: 0, // Default to 0
        healthCondition: healthCondition, // Always 'string'
        sugarPercentage: sugarPercentage,
        bloodPressure: bloodPressure,
        averageTemprature: averageTemperature,
        date: date,
        time: time,
    };

    try {
        const response = await fetch(`${addBioApiUrl}${patientId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bioData),
        });

        if (response.ok) {
            alert('Biological Indicator Added Successfully!');
            window.location.href = './patient.html'; // Redirect to main page or list page
        } else {
            const errorDetails = await response.json();
            console.error('Error:', errorDetails);
            alert(`Failed to Add Bio: ${errorDetails.title}`);
        }
    } catch (error) {
        console.error('Request Error:', error);
        alert(`Request failed: ${error.message}`);
    }
});
