const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/'; // API endpoint for deleting a patient
let hospitals = [];

const canvas = document.getElementById('bloodPressureChart'); // Replace with your canvas ID
const ctx = canvas.getContext('2d');

// Create a gradient for the background
const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Vertical gradient
gradient.addColorStop(0, 'rgba(248, 104, 52, 0.5)'); // Start color (transparent orange)
gradient.addColorStop(1, 'rgba(248, 104, 52, 0)');   // End color (fully transparent)

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
                    <th></th>
                    <th>Name</th>
                    <th>Hospital</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => {
                    const condition = patient.lastBiologicalIndicator?.healthCondition || 'Unspecified';
                    const isAtRisk = condition === 'At Risk';
                    const isHealthy = condition === 'Healthy';
                    const isUnspecified = condition === 'Unspecified';
                return`
                    <tr>
                    <td>
                            ${isAtRisk ? '<span class="red-sign"></span>' : ''}
                            ${isHealthy ? '<span class="green-sign"></span>' : ''}
                            ${isUnspecified ? '<span class="yellow-sign"></span>' : ''}
                        </td>
                        <td>${patient.name}</td>
                        <td>${getHospitalName(patient.hospitalId)}</td>
                        <td>
                            <button id=AddBio  onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                            <button id=ViewBio onclick="window.location.href='viewBio.html?patientName=${patient.name}'">View Bio</button>
                            <button id=update onclick="window.location.href='updatePatient.Html?patientId=${patient.id}'">Update</button>
                            <button id=delete onclick="deletePatient('${patient.id}')">Delete</button> 
                        </td>
                    </tr>
                `}).join('')}
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
    const apiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/GetAllCritical'; // Replace with your actual API URL

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
            // Create an empty object to track date counts
            const dateCounts = {};
        
            // Iterate over the data
            data.forEach(item => {
                const date = item.date;  // Access the date
                const patients = item.patients;  // Access the patients array
                
                // Filter patients with blood pressure > 120
                const highBPCount = patients.filter(patient => patient.lastBiologicalIndicator.bloodPressure > 120).length;
        
                if (highBPCount > 0) {
                    dateCounts[date] = highBPCount;  // Store the count of patients for the given date
                }
            });
        
            // Convert dateCounts to an array of [date, count] pairs
            const sortedDateCounts = Object.entries(dateCounts)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]));  // Sort by date
        
            // Prepare sorted timeLabels and Count arrays
            const timeLabels = sortedDateCounts.map(item => item[0]);  // Extract the sorted dates
            const Count = sortedDateCounts.map(item => item[1]);  

            
            // Create the Chart.js line chart with the dynamic data
            const bloodPressureChart = new Chart(ctx, {
                type: 'line', // Line chart
                data: {
                    labels: timeLabels, // Dynamic time (X-axis) labels
                    datasets: [{
                        label: 'Count',
                        data: Count, // Blood pressure values (Y-axis)
                        borderColor: 'rgba(248, 104, 52, 0.5)', // Line color
                        backgroundColor: gradient, // Gradient fill under the line
                        pointBackgroundColor: 'rgba(248, 104, 52, 0.5)', // Point color
                        pointBorderColor: '#fff', // Point border color
                        pointHoverBackgroundColor: '#fff', // Hover point color
                        pointHoverBorderColor: 'rgba(75, 192, 192, 1)', // Hover point border color
                        borderWidth: 2,
                        tension: 0.3, // Smooth curve
                        fill: true, // Fill under the line
                    }]
                },
                options: {
                    responsive: true, // Adjusts chart size for different screen sizes
                    maintainAspectRatio: false, // Better for embedded charts
                    plugins: {
                        title: {
                            display: true,
                            text: 'Blood Pressure Trends Over Time', // Chart title
                            color: '#333', // Title color
                            font: {
                                size: 20, // Font size
                                weight: 'bold', // Font weight
                                family: 'Arial' // Font family
                            },
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        },
                        legend: {
                            display: false, // Hide legend
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false // Disable grid lines on the x-axis
                            },
                            title: {
                                display: true,
                                text: "Date",
                                font: {
                                    size: 14
                                }
                            },
                            ticks: {
                                font: {
                                    size: 10
                                },
                                maxRotation: 45, // Maximum rotation in degrees
                                minRotation: 45 // Minimum rotation in degrees
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Count of Patients with High BP',
                                font: {
                                    size: 16,
                                    weight: 'bold'
                                }
                            },
                            min: 0, // Start Y-axis from 0
                        }
                    }
                }
            });
        } else {
            alert('No critical patients data found.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);  // Log any error that occurs during the fetch request
    });
});
