const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/'; // API endpoint for deleting a patient
let hospitals = [];



// Function to toggle the sidebar open/close
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");  // Toggle the 'open' class on the sidebar
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
    renderPatients(patients);
}

// Render the patients in the table
function renderPatients(patients) {
    // Sort patients by healthCondition (At Risk > Unhealthy > Healthy > Unspecified)
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
                    <th id ="Hospital">Hospital</th>
                    <th id="Actions" >Actions</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => {
                    const condition = patient.lastBiologicalIndicator?.healthCondition || 'Unspecified';
                    const isAtRisk = condition === 'At Risk';
                    const isHealthy = condition === 'Healthy';
                    const isUnspecified = condition === 'Unspecified';

                    return `
                    <tr style="${isAtRisk ? 'background-color: rgba(248,104,52,0.15);' : ''}
                    
                    ${isHealthy ? ' background-color: rgba(0, 252, 122, 0.1);' : ''}
                    ">
                       
                        <td>${patient.name}</td>

                        <td>${getHospitalName(patient.hospitalId)}</td>
                        <td>
                        
                            <button id="AddBio" onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                            <button id="ViewBio" onclick="window.location.href='viewBio.html?patientName=${patient.name}&patientAge=${patient.age}'">View Bio</button>
                            <button id="update" onclick="window.location.href='updatePatient.Html?patientId=${patient.id}'">Update</button>
                            <button id="delete" onclick="deletePatient('${patient.id}')">Delete</button>
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
