/**
 * Patient Management System Script
 * 
 * This script handles the following functionalities:
 * - Fetching hospital and patient data from APIs and rendering them in a table.
 * - Providing actions to add, view, update, and delete patient records.
 * - Sorting patients by their health condition for better visualization.
 * - Using a custom modal for delete and update confirmations to enhance user experience.
 */

const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/';
let hospitals = [];

// Function to toggle the sidebar open/close
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}

// Get the token from localStorage
function getToken() {
    return localStorage.getItem('auth_token');
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
    renderPatients(patients.reverse());
}

// Render the patients in the table
function renderPatients(patients) {
    const healthOrder = ['At Risk', 'Unhealthy', 'Healthy', 'Unspecified'];
    patients.sort((a, b) => {
        const aCondition = a.lastBiologicalIndicator?.healthCondition || 'Unspecified';
        const bCondition = b.lastBiologicalIndicator?.healthCondition || 'Unspecified';
        const aConditionIndex = healthOrder.indexOf(aCondition);
        const bConditionIndex = healthOrder.indexOf(bCondition);
        return aConditionIndex - bConditionIndex;
    });

    const patientList = document.getElementById('patientList');
    patientList.innerHTML = `
        <table class="patient-table">
            <thead>
                <tr>
                    <th id="Name">Name</th>
                    <th id="Hospital">Hospital</th>
                    <th id="Actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => {
                    const condition = patient.lastBiologicalIndicator?.healthCondition || 'Unspecified';
                    const isAtRisk = condition === 'At Risk';
                    const isHealthy = condition === 'Healthy';

                    return `
                    <tr style="${isAtRisk ? 'background-color: rgba(248,104,52,0.15);' : ''}
                    ${isHealthy ? 'background-color: rgba(0, 252, 122, 0.1);' : ''}">
                        <td>${patient.name}</td>
                        <td>${getHospitalName(patient.hospitalId)}</td>
                        <td>
                            <button class="localizable-button" data-key="AddBio" id="AddBioButton" onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                            <button class="localizable-button"   data-key="ViewBio" id="ViewBioButton" onclick="window.location.href='viewBio.html?patientName=${patient.name}&patientAge=${patient.age}'">View Bio</button>
                            <button class="localizable-button" data-key="update" id="UpdateButton" onclick="showConfirmationModal('update', '${patient.id}')">Update</button>
                            <button class="localizable-button" data-key="delete" id="DeleteButton" onclick="showConfirmationModal('delete', '${patient.id}')" >Delete</button>
                        </td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    changeLanguage();
}

// Get the hospital name based on hospitalId
function getHospitalName(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : 'Unknown';
}

// Show a custom confirmation modal
function showConfirmationModal(action, patientId) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('confirmButton');

    modalMessage.textContent = action === 'delete'
        ? 'Are you sure you want to delete this patient?'
        : 'Are you sure you want to update this patient?';

    confirmButton.onclick = () => {
        modal.style.display = 'none';
        if (action === 'delete') {
            deletePatient(patientId);
        } else if (action === 'update') {
            window.location.href = `updatePatient.Html?patientId=${patientId}`;
        }
    };

    modal.style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
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
            alert('Patient deleted successfully!');
            fetchPatients(); // Refresh the list of patients
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
