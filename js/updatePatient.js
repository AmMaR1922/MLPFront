const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const updatePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/UpdatePatient/';
const getPatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/GetUserInformation/';

// Function to get the token from localStorage
function getToken() {
    return localStorage.getItem('auth_token');
}

// Fetch patient details to populate the form
async function fetchPatientDetails(patientName) {
    const token = getToken();
    const response = await fetch(getPatientApiUrl + patientName, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        console.log('Failed to fetch patient data', response.status);
        return;
    }

    const patient = await response.json();
    console.log('Patient data:', patient); // Debugging: Check the response data

    // Check if the necessary fields exist and are valid
    if (patient && patient.name) {
        document.getElementById('name').value = patient.name || '';
        document.getElementById('phoneNumber').value = patient.phoneNumber || '';
        document.getElementById('address').value = patient.address || '';
        document.getElementById('sex').value = patient.sex !== undefined ? patient.sex.toString() : '';
        document.getElementById('pregnant').value = patient.pregnant !== undefined ? patient.pregnant.toString() : '';
        document.getElementById('numberOfBirths').value = patient.numberOfBirth !== undefined ? patient.numberOfBirth : '';
        document.getElementById('hospital').value = patient.hospitalId !== undefined ? patient.hospitalId : '';

        // Show pregnancy-related fields if the patient is female
        showPregnancyFields(patient.sex !== undefined ? (patient.sex ? 'true' : 'false') : '');
    } else {
        console.error('Patient data is incomplete or missing.');
    }
}

// Fetch hospitals and populate the hospital dropdown
async function fetchHospitals() {
    const token = getToken();
    const response = await fetch(hospitalsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const hospitals = await response.json();
    populateHospitalSelect(hospitals);
}

// Populate the hospital dropdown
function populateHospitalSelect(hospitals) {
    const hospitalSelect = document.getElementById('hospital');
    hospitals.forEach(hospital => {
        const option = document.createElement('option');
        option.value = hospital.id;
        option.textContent = hospital.name;
        hospitalSelect.appendChild(option);
    });
}

// Handle form submission for updating the patient
async function handleUpdatePatient(event, patientName) {
    event.preventDefault();

    const token = getToken();
    const patientData = {
        id: patientName,
        name: document.getElementById('name').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        sex: document.getElementById('sex').value === 'true',
        pregnant: document.getElementById('pregnant').value === 'true',
        numberOfBirth: parseInt(document.getElementById('numberOfBirths').value, 10) || 0,
        hospitalId: parseInt(document.getElementById('hospital').value, 10)
    };

    try {
        const response = await fetch(updatePatientApiUrl + patientName, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert('Patient updated successfully!');
        } else {
            const errorDetails = await response.json();
            alert(`Failed to update patient: ${errorDetails.title}`);
        }
    } catch (error) {
        alert(`Request failed: ${error.message}`);
    }
}

// Show/hide pregnancy-related fields based on sex selection
document.getElementById('sex').addEventListener('change', function () {
    const sex = this.value;
    showPregnancyFields(sex);
});

function showPregnancyFields(sex) {
    const pregnantField = document.getElementById('pregnantField');
    const numberOfBirthsField = document.getElementById('numberOfBirthsField');

    if (sex === 'false') {
        pregnantField.style.display = 'block';
        numberOfBirthsField.style.display = 'block';
    } else {
        pregnantField.style.display = 'none';
        numberOfBirthsField.style.display = 'none';
    }
}

// Get patientName from URL and initialize the page
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientName = urlParams.get('patientId');
    console.log('Patient Name:', patientName); // Debugging: Check if it's correct
    if (patientName) {
        await fetchHospitals();
        await fetchPatientDetails(patientName);
        document.getElementById('updatePatientFormFields').addEventListener('submit', (e) => handleUpdatePatient(e, patientName));
    }
}

init();
