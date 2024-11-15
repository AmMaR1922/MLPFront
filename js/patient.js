// Store patients and their biological indicators in localStorage
const getPatients = () => JSON.parse(localStorage.getItem('patients')) || [];
const savePatients = (patients) => localStorage.setItem('patients', JSON.stringify(patients));

// Display patients in a table format
function displayPatients() {
    const patients = getPatients();
    const patientListDiv = document.getElementById('patientList');
    const addPatientFormDiv = document.getElementById('addPatientForm');

    if (patients.length === 0) {
        patientListDiv.innerHTML = '<p>No patients found.</p>';
    } else {
        patientListDiv.innerHTML = `
            <table class="patient-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Sex</th>
                        <th>Pregnant</th>
                        <th>Number of Births</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(patient => `
                        <tr>
                            <td>${patient.id}</td>
                            <td>${patient.name}</td>
                            <td>${patient.phoneNumber}</td>
                            <td>${patient.address}</td>
                            <td>${patient.sex}</td>
                            <td>${patient.pregnant || '-'}</td>
                            <td>${patient.numberOfBirths || '-'}</td>
                            <td>
                                <button onclick="addBiologicalIndicator(${patient.id})">
                                    Add Biological Indicator
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    addPatientFormDiv.style.display = patients.length > 0 ? 'none' : 'block';
}

// Toggle the Add Patient Form
function toggleAddPatientForm() {
    const addPatientFormDiv = document.getElementById('addPatientForm');
    const patientListDiv = document.getElementById('patientList');

    if (addPatientFormDiv.style.display === 'none') {
        addPatientFormDiv.style.display = 'block';
        patientListDiv.style.display = 'none';
    } else {
        addPatientFormDiv.style.display = 'none';
        patientListDiv.style.display = 'block';
    }
}

// Save new patient data
document.getElementById('patientForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const patients = getPatients();

    const newPatient = {
        id: patients.length + 1,
        name: document.getElementById('name').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        sex: document.getElementById('sex').value,
        pregnant: document.getElementById('pregnant').value || null,
        numberOfBirths: document.getElementById('numberOfBirths').value || null
    };

    patients.push(newPatient);
    savePatients(patients);

    document.getElementById('responseMessage').textContent = 'Patient added successfully!';
    document.getElementById('patientForm').reset();

    displayPatients();
    setTimeout(() => {
        document.getElementById('responseMessage').textContent = '';
    }, 2000);
});

// Navigate to the biological indicator form
function addBiologicalIndicator(patientId) {
    localStorage.setItem('currentPatientId', patientId);
    window.location.href = 'biological.html';
}

// Show or hide fields based on selected sex
document.getElementById('sex').addEventListener('change', function () {
    const pregnantField = document.getElementById('pregnantField');
    const numberOfBirthsField = document.getElementById('numberOfBirthsField');

    if (this.value === 'female') {
        pregnantField.style.display = 'block';
        document.getElementById('pregnant').addEventListener('change', function () {
            if (this.value === 'yes') {
                numberOfBirthsField.style.display = 'block';
            } else {
                numberOfBirthsField.style.display = 'none';
            }
        });
    } else {
        pregnantField.style.display = 'none';
        numberOfBirthsField.style.display = 'none';
    }
});

// Navigate to another page
function navigateTo(page) {
    if (page === 'dashboard') {
        window.location.href = 'dashboard.html';
    }
}

// Load patients when the page loads
displayPatients();
// Navigate to the biological indicator form and store patient name
function addBiologicalIndicator(patientId) {
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId);

    // Store patient's name in localStorage
    localStorage.setItem('currentPatientName', patient.name);

    // Store patient ID in localStorage for later use
    localStorage.setItem('currentPatientId', patientId);

    // Redirect to the biological indicator page
    window.location.href = 'biological.html';
}
