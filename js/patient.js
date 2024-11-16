const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const patientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/CreatePatient';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';

// Helper function to get the authorization token
function getToken() {
    return 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJNb2hhbWVkXzEwIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiTW83YW1lZDYxMDIwMDNAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3MzE4OTE1NzcsImlzcyI6Imh0dHBzOi8vYW50ZXNobmF0c2gudHJ5YXNwLm5ldCIsImF1ZCI6Ik15U2VjdXJlS2V5In0.Kcc4cffOFXempRLToI9gi8lFleSFcz32k4ynWNz0RJ0';
}

// Fetch all hospitals from the API
let hospitals = [];
async function fetchHospitals() {
    const token = getToken();
    try {
        const response = await fetch(hospitalsApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch hospitals.');
        }

        hospitals = await response.json();
        
        // Log hospitals to verify they are being fetched correctly
        console.log("Fetched hospitals:", hospitals);

        populateHospitalSelect(); // Call the function to populate the select dropdown after fetching hospitals

    } catch (error) {
        console.error('Error fetching hospitals:', error);
    }
}

// Populate the hospital select dropdown
function populateHospitalSelect() {
    const hospitalSelect = document.getElementById('hospital');
    hospitalSelect.innerHTML = '<option value="">Select a Hospital</option>'; // Clear any existing options

    // Add each hospital as an option in the select dropdown
    hospitals.forEach(hospital => {
        const option = document.createElement('option');
        option.value = hospital.id;  // Use the hospital ID as the value
        option.textContent = hospital.name;  // Display the hospital name in the dropdown
        hospitalSelect.appendChild(option);
    });

    // Log to check if the dropdown is populated
    console.log("Populated hospital dropdown:", hospitalSelect);
}

// Fetch all patients from the API
async function fetchPatients() {
    const token = getToken();
    const patientListDiv = document.getElementById('patientList');

    try {
        const response = await fetch(allPatientsApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch patients.');
        }

        const patients = await response.json();

        // Display patients in a table format
        if (patients.length === 0) {
            patientListDiv.innerHTML = '<p>No patients found.</p>';
        } else {
            patientListDiv.innerHTML = `
                <table class="patient-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>State</th>
                            <th>Hospital</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${patients.map(patient => `
                            <tr>
                                <td>${patient.name}</td>
                                <td>${patient.state}</td>
                                <td>${getHospitalName(patient.hospitalId)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

// Get hospital name by hospitalId
function getHospitalName(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : 'Unknown';
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
document.getElementById('patientForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = getToken();
    const newPatient = {
        name: document.getElementById('name').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        sex: document.getElementById('sex').value === 'true', // Convert to boolean
        pregnant: document.getElementById('pregnant').value === 'true', // Convert to boolean
        numberOfBirth: document.getElementById('numberOfBirths').value || 0,
        hospitalId: document.getElementById('hospital').value
    };

    try {
        const response = await fetch(patientApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPatient)
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Patient added successfully!';
            toggleAddPatientForm();
            fetchPatients(); // Refresh the patient list
        } else {
            throw new Error('Failed to save patient.');
        }

    } catch (error) {
        console.error('Error adding patient:', error);
        document.getElementById('responseMessage').innerText = 'Error adding patient.';
    }
});

// Navigate to another page (e.g., Dashboard)
function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Load hospitals and patients when the page loads
async function init() {
    await fetchHospitals(); // Fetch hospitals before fetching patients
    fetchPatients(); // Then fetch and display patients
}



// Call the init function to load hospitals and patients
init();
