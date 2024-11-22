const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/'; // API endpoint for deleting a patient
let hospitals = [];

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
    
    patients.sort((a, b) => {
        const bpA = a.lastBiologicalIndicator?.bloodPressure ?? 0; // Handle missing data with `??`
        const bpB = b.lastBiologicalIndicator?.bloodPressure ?? 0;
        return bpB - bpA; // Descending order
    });

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
                        <td>${patient.lastBiologicalIndicator.healthCondition}</td>
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




//Graph
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('bloodPressureChart').getContext('2d');

    // Assume you already have the token from somewhere (e.g., stored in localStorage or obtained via login)
    const token = getToken();
    // Replace with your actual token

    // Your API URL (GET request)
    const apiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/GetAllBiologicalIndicator'; // Replace with your actual API URL

    // Create the GET request with headers
    fetch(apiUrl, {
        method: 'GET',  // Set method to 'GET'
        headers: {
            'Authorization': `Bearer ${token}`,  // Include Authorization header
            'Content-Type': 'application/json'  // Specify content type as JSON (though not necessary for GET requests)
        }
    })
    .then(response => response.json())  // Convert the response to JSON
    .then(data => {
        // Check if data is returned and process it
        console.log(data);  // Log the data to see the structure
        
        if (Array.isArray(data) && data.length > 0) {
            // Process the response to extract time (date) and blood pressure values
            const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Process the sorted data to extract time and blood pressure values
            const timeLabels = sortedData.map(item => item.date);  // Extract date from the sorted data
            const bloodPressureValues = sortedData.map(item => item.bloodPressure);  

            // Create the Chart.js line chart with the dynamic data
            const bloodPressureChart = new Chart(ctx, {
                type: 'line',  // Type of chart: Line chart for continuous data
                data: {
                    labels: timeLabels,  // Dynamic time (X-axis) labels (converted to timestamps)
                    datasets: [{
                        label: 'Blood Pressure (mmHg)',
                        data: bloodPressureValues,  // Dynamic blood pressure values (Y-axis)
                        borderColor: 'rgba(75, 192, 192, 1)',  // Line color
                        fill: false,  // No fill under the line
                        tension: 0.1,  // Smooth the line
                        borderWidth: 2,
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',  // The X-axis will be based on time (date/timestamp)
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Date',  // Title for X-axis
                            },
                            time: {
                                unit: 'day',  // Time unit for the X-axis (you can change to 'hour', 'minute', etc.)
                                tooltipFormat: 'll',  // Tooltip format (long date format)
                                displayFormats: {
                                    day: 'MMM dd, yyyy',  // Label format on the X-axis
                                },
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                            }
                        },
                        y: {
                            beginAtZero: false,  // Do not force the Y-axis to start at zero
                            title: {
                                display: true,
                                text: 'Blood Pressure (mmHg)',  // Y-axis title
                            },
                            ticks: {
                                stepSize: 10,  // Spacing of tick marks on the Y-axis
                            }
                        }
                    }
                }
            });
        } else {
            console.error('Invalid data format or empty data received from the API.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});














// document.addEventListener('DOMContentLoaded', function () {
//     const ctx = document.getElementById('bloodPressureChart').getContext('2d');

//     // Static data for blood pressure (time in seconds and blood pressure values)
//     const timeLabels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  // Time labels (in seconds)
//     const bloodPressureValues = [120, 125, 130, 128, 135, 140, 138, 137, 136, 134, 132];  // Blood pressure values

//     // Create the Chart.js line chart
//     const bloodPressureChart = new Chart(ctx, {
//         type: 'line',  // Type of chart: Line chart for continuous data
//         data: {
//             labels: timeLabels,  // Time (X-axis) labels
//             datasets: [{
//                 label: 'Blood Pressure (mmHg)',
//                 data: bloodPressureValues,  // Data for the Y-axis
//                 borderColor: 'rgba(75, 192, 192, 1)',  // Line color
//                 fill: false,  // No fill under the line
//                 tension: 0.1,  // Smooths the line
//                 borderWidth: 2,
//             }]
//         },
//         options: {
//             scales: {
//                 x: {
//                     type: 'linear',  // The X-axis is continuous (linear)
//                     position: 'bottom',
//                     title: {
//                         display: true,
//                         text: 'Time (seconds)',  // Title for X-axis
//                     },
//                     ticks: {
//                         autoSkip: true,
//                         maxTicksLimit: 10,
//                     }
//                 },
//                 y: {
//                     beginAtZero: false,  // Do not force the Y-axis to start at zero
//                     title: {
//                         display: true,
//                         text: 'Blood Pressure (mmHg)',  // Y-axis title
//                     },
//                     ticks: {
//                         stepSize: 10,  // Spacing of tick marks on the Y-axis
//                     }
//                 }
//             }
//         }
//     });
// });
