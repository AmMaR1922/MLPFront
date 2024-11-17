const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/'; // API endpoint for deleting a patient
let hospitals = [];

// Get the token from localStorage
function getToken() {
    return localStorage.getItem('authToken');
}

// Fetch hospitals and store them globally
async function fetchHospitals() {
    const token = getToken();
    const response = await fetch(hospitalsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    hospitals = await response.json();
}

// Fetch and display patients after hospitals data is loaded
async function fetchPatients() {
    await fetchHospitals(); // Ensure hospitals are fetched first

    const token = getToken();
    const response = await fetch(allPatientsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const patients = await response.json();
    renderPatients(patients);
}

// Render the patients in the table
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
                            <button id=AddBio  onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                            <button id=ViewBio onclick="window.location.href='viewBio.html?patientName=${patient.name}'">View Bio</button>
                            <button id=update onclick="window.location.href='updatePatient.Html?patientId=${patient.id}'">Update</button>
                            <button id=delete onclick="deletePatient('${patient.id}')">Delete</button>
                            
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Get the hospital name based on hospitalId
function getHospitalName(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : 'Unknown';
}

// Delete the patient using the API
async function deletePatient(patientId) {
    const token = getToken();
    try {
        const response = await fetch(`${deletePatientApiUrl}${patientId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // If delete is successful, re-fetch patients and update the table
            alert('Patient deleted successfully!');
            fetchPatients();
        } else {
            const errorDetails = await response.json();
            alert(`Failed to delete patient: ${errorDetails.title}`);
        }
    } catch (error) {
        alert(`Request failed: ${error.message}`);
    }
}

// Initialize
fetchPatients();
