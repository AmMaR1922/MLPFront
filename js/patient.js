const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const patientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/CreatePatient';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const addBioApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AddBio/';
const getBioApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/';

function getToken() {
    return localStorage.getItem('authToken');
}

let hospitals = [];

// Fetch hospitals and populate dropdown
async function fetchHospitals() {
    const token = getToken();
    const response = await fetch(hospitalsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    hospitals = await response.json();
    populateHospitalSelect();
}

function populateHospitalSelect() {
    const hospitalSelect = document.getElementById('hospital');
    hospitals.forEach(hospital => {
        const option = document.createElement('option');
        option.value = hospital.id;
        option.textContent = hospital.name;
        hospitalSelect.appendChild(option);
    });
}

// Fetch and display patients
async function fetchPatients() {
    const token = getToken();
    const response = await fetch(allPatientsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const patients = await response.json();
    renderPatients(patients);
}

function renderPatients(patients) {
    const patientList = document.getElementById('patientList');
    patientList.innerHTML = `
        <table class="patient-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>State</th>
                    <th>Hospital</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => `
                    <tr>
                        <td>${patient.name}</td>
                        <td>${patient.state}</td>
                        <td>${getHospitalName(patient.hospitalId)}</td>
                        <td>
                            <button onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                            <button onclick="window.location.href='viewBio.html?patientName=${patient.name}'">View Bio</button>
                            <button onclick="deletePatient('${patient.id}')">Delete</button>
                            <button onclick="window.location.href='updatePatient.html?patientId=${patient.id}'">Update</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getHospitalName(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : 'Unknown';
}

// Save new patient
async function savePatient(event) {
    event.preventDefault();

    const token = getToken();

    // Gather form data
    const name = document.getElementById('name').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;
    const sex = document.getElementById('sex').value === 'true';
    const pregnant = document.getElementById('pregnant').value === 'true';
    const numberOfBirths = parseInt(document.getElementById('numberOfBirths').value, 10);
    const hospitalId = parseInt(document.getElementById('hospital').value, 10);

    const patientData = {
        id: 0,
        name,
        phoneNumber,
        address,
        sex,
        pregnant: sex ? false : pregnant, // Set to false if male
        numberOfBirth: numberOfBirths || 0,
        hospitalId
    };

    try {
        const response = await fetch(patientApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert('Patient added successfully!');
            fetchPatients();
            toggleAddPatientForm(); // Hide the form
        } else {
            const errorDetails = await response.json();
            alert(`Failed to add patient: ${errorDetails.title}`);
        }
    } catch (error) {
        alert(`Request failed: ${error.message}`);
    }
}

// Toggle Add Patient Form
function toggleAddPatientForm() {
    const form = document.getElementById('addPatientForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Show/hide pregnancy-related fields based on sex selection
document.getElementById('sex').addEventListener('change', function () {
    const sex = this.value;
    const pregnantField = document.getElementById('pregnantField');
    const numberOfBirthsField = document.getElementById('numberOfBirthsField');

    if (sex === 'false') {
        pregnantField.style.display = 'block';
        numberOfBirthsField.style.display = 'block';
    } else {
        pregnantField.style.display = 'none';
        numberOfBirthsField.style.display = 'none';
    }
});

// Initialize
async function init() {
    await fetchHospitals();
    await fetchPatients();
    document.getElementById('patientForm').addEventListener('submit', savePatient);
}
init();
