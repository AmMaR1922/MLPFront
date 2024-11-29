const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const patientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/CreatePatient';

function getToken() {
    return localStorage.getItem('auth_token');
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
            window.location.href = 'patient.html'; // Redirect to patient list
        } else {
            const errorDetails = await response.json();
            alert(`Failed to add patient: ${errorDetails.title}`);
        }
    } catch (error) {
        alert(`Request failed: ${error.message}`);
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const sexSelect = document.getElementById("sex");
    const pregnantField = document.getElementById("pregnantField");
    const pregnantSelect = document.getElementById("pregnant");
    const numberOfBirthsField = document.getElementById("numberOfBirthsField");

    // Handle visibility of Pregnant field based on selected sex
    sexSelect.addEventListener("change", function () {
        if (sexSelect.value === "false") { // Female
            pregnantField.style.display = "block";
        } else {
            pregnantField.style.display = "none";
            numberOfBirthsField.style.display = "none"; // Hide Number of Births if switching back
        }
    });

    // Handle visibility of Number of Births field based on Pregnant field selection
    pregnantSelect.addEventListener("change", function () {
        if (pregnantSelect.value === "true") { // Yes
            numberOfBirthsField.style.display = "block";
        } else {
            numberOfBirthsField.style.display = "none";
        }
    });
});


// Initialize
async function init() {
    await fetchHospitals();
    document.getElementById('patientForm').addEventListener('submit', savePatient);
}

init();
