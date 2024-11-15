// Event listener for gender change to show or hide relevant fields
document.getElementById('sex').addEventListener('change', function() {
    const selectedSex = this.value;
    const pregnantField = document.getElementById('pregnantField');
    const numberOfBirthsField = document.getElementById('numberOfBirthsField');

    if (selectedSex === 'female') {
        pregnantField.style.display = 'block';
    } else {
        pregnantField.style.display = 'none';
        numberOfBirthsField.style.display = 'none';
    }
});

// Event listener for pregnant field change to show or hide number of births
document.getElementById('pregnant').addEventListener('change', function() {
    const selectedPregnant = this.value;
    const numberOfBirthsField = document.getElementById('numberOfBirthsField');

    if (selectedPregnant === 'yes') {
        numberOfBirthsField.style.display = 'block';
    } else {
        numberOfBirthsField.style.display = 'none';
    }
});

// Show patients or "No patients found"
function displayPatients() {
    const patientList = JSON.parse(localStorage.getItem('patients')) || [];
    const patientListDiv = document.getElementById('patientList');

    if (patientList.length === 0) {
        patientListDiv.innerHTML = '<p>No patients found. Please add a new patient.</p>';
    } else {
        patientListDiv.innerHTML = `
            <div class="patient-row">
                <div class="patient-header">Name</div>
                <div class="patient-header">Phone Number</div>
                <div class="patient-header">Address</div>
                <div class="patient-header">Sex</div>
                <div class="patient-header">Pregnant</div>
                <div class="patient-header">Number of Births</div>
            </div>
            ${patientList.map(patient => `
                <div class="patient-row">
                    <div class="patient-data">${patient.name}</div>
                    <div class="patient-data">${patient.phoneNumber}</div>
                    <div class="patient-data">${patient.address}</div>
                    <div class="patient-data">${patient.sex}</div>
                    <div class="patient-data">${patient.pregnant || 'N/A'}</div>
                    <div class="patient-data">${patient.numberOfBirths || 'N/A'}</div>
                </div>
            `).join('')}
        `;
    }
}

// Save new patient data to localStorage
document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const patientData = {
        name: document.getElementById('name').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        sex: document.getElementById('sex').value,
        pregnant: document.getElementById('pregnant') ? document.getElementById('pregnant').value : null,
        numberOfBirths: document.getElementById('numberOfBirths') ? document.getElementById('numberOfBirths').value : null
    };

    const patientList = JSON.parse(localStorage.getItem('patients')) || [];
    patientList.push(patientData);
    localStorage.setItem('patients', JSON.stringify(patientList));

    document.getElementById('responseMessage').textContent = 'Patient added successfully!';
    document.getElementById('patientForm').reset();
    setTimeout(() => {
        window.location.href = 'patient.html';  // Refresh the page to show the updated list
    }, 2000);
});

// Display patients when the page loads
displayPatients();

// Navigate back to dashboard
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    }
}
