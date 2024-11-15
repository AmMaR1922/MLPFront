// Get the current patient ID from localStorage
const patientId = localStorage.getItem('currentPatientId');

// Get the patient's name from localStorage
const patientName = localStorage.getItem('currentPatientName');

// Display the patient's name above the form
document.getElementById('patientNameDisplay').textContent = `Adding Biological Indicator for: ${patientName}`;

// Hide the "Add Biological Indicator" button once we're on this page
document.getElementById('addBiologicalButton').style.display = 'none';

// Get all biological indicators from localStorage
const getBiologicalIndicators = () => JSON.parse(localStorage.getItem('biologicalIndicators')) || [];

// Save biological indicators to localStorage
const saveBiologicalIndicators = (biologicalIndicators) => {
    localStorage.setItem('biologicalIndicators', JSON.stringify(biologicalIndicators));
};

// Display biological indicators associated with the current patient
function displayBiologicalIndicators() {
    const biologicalIndicators = getBiologicalIndicators();
    const biologicalListDiv = document.getElementById('biologicalList');
    const addBiologicalFormDiv = document.getElementById('addBiologicalForm');

    // Filter indicators for the current patient
    const patientBiologicalIndicators = biologicalIndicators.filter(bi => bi.patientId == patientId);

    if (patientBiologicalIndicators.length === 0) {
        biologicalListDiv.innerHTML = '<p>No biological indicators found for this patient.</p>';
    } else {
        biologicalListDiv.innerHTML = `
            <table class="biological-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Health Condition Score</th>
                        <th>Health Condition</th>
                        <th>Sugar Percentage</th>
                        <th>Blood Pressure</th>
                        <th>Average Temperature</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${patientBiologicalIndicators.map(data => `
                        <tr>
                            <td>${data.date}</td>
                            <td>${data.healthConditionScore}</td>
                            <td>${data.healthCondition}</td>
                            <td>${data.sugarPercentage}</td>
                            <td>${data.bloodPressure}</td>
                            <td>${data.averageTemperature}</td>
                            <td>${data.time}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Hide the add biological form once we have data
    addBiologicalFormDiv.style.display = patientBiologicalIndicators.length > 0 ? 'none' : 'block';
}

// Show the form to add a new biological indicator
function toggleAddForm() {
    const addBiologicalFormDiv = document.getElementById('addBiologicalForm');
    const biologicalListDiv = document.getElementById('biologicalList');

    if (addBiologicalFormDiv.style.display === 'none') {
        addBiologicalFormDiv.style.display = 'block';
        biologicalListDiv.style.display = 'none';
    } else {
        addBiologicalFormDiv.style.display = 'none';
        biologicalListDiv.style.display = 'block';
    }
}

// Save new biological indicator data to localStorage
document.getElementById('biologicalForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const biologicalData = {
        patientId: patientId,  // Associate biological indicator with the current patient
        date: document.getElementById('date').value,
        healthConditionScore: document.getElementById('healthConditionScore').value,
        healthCondition: document.getElementById('healthCondition').value,
        sugarPercentage: document.getElementById('sugarPercentage').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        averageTemperature: document.getElementById('averageTemperature').value,
        time: document.getElementById('time').value,
    };

    const biologicalIndicators = getBiologicalIndicators();
    biologicalIndicators.push(biologicalData);
    saveBiologicalIndicators(biologicalIndicators);

    document.getElementById('responseMessage').textContent = 'Biological indicator information saved successfully!';
    document.getElementById('biologicalForm').reset();

    // Update biological indicator list and hide form
    displayBiologicalIndicators();
    setTimeout(() => {
        document.getElementById('responseMessage').textContent = '';  // Clear message
    }, 2000);

    // Redirect to the patient’s biological indicator list page after saving
    setTimeout(() => {
        window.location.href = 'biologicalList.html';  // Redirect to the page that shows the biological indicators
    }, 2000);
});

// Navigate back to the dashboard
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    }
}

// Display biological indicators when the page loads
displayBiologicalIndicators();
