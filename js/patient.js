const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const patientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/CreatePatient';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const addBioApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AddBio/';
const getBioApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeleteBio/';

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
                            <button onclick="addBio('${patient.id}')">Add Bio</button>
                            <button onclick="viewBio('${patient.name}')">View Bio</button>
                            <button onclick="deletePatient('${patient.id}')">Delete</button>
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

// Add bio
async function addBio(patientId) {
    const token = getToken();
    const response = await fetch(`${addBioApiUrl}${patientId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    alert(response.ok ? 'Biological Indicator Added!' : 'Failed to Add Bio');
}

// View bio
async function viewBio(patientName) {
    const token = getToken();
    const response = await fetch(`${getBioApiUrl}${patientName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const bioIndicators = await response.json();
    alert(`Bio Indicators for ${patientName}: ${JSON.stringify(bioIndicators)}`);
}

// Delete patient
async function deletePatient(patientId) {
    const token = getToken();
    const response = await fetch(`${deletePatientApiUrl}${patientId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
        alert('Patient Deleted!');
        fetchPatients();
    } else {
        alert('Failed to Delete Patient');
    }
}

// Toggle Add Patient Form
function toggleAddPatientForm() {
    const form = document.getElementById('addPatientForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Initialize
async function init() {
    await fetchHospitals();
    await fetchPatients();
}

init();
