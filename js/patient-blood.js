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
                            <!--${condition}-->
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

            
// Extract blood pressure values
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
                            display: true, // Show legend
                            labels: {
                                color: '#555', // Legend text color
                                font: {
                                    size: 12, // Font size for legend
                                    family: 'Arial'
                                },
                                padding: 10
                            },
                            position: 'top'
                        },
                        tooltip: {
                            enabled: true, // Show tooltips
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Tooltip background
                            titleColor: '#fff', // Tooltip title color
                            bodyColor: '#fff', // Tooltip body text color
                            padding: 10,
                            callbacks: {
                                title: function (tooltipItem) {
                                    return 'Date: ' + tooltipItem[0].label; // Show the date as the tooltip title
                                },
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.raw + ' Patients'; // Tooltip data value
                                    return label;
                                }
                            }
                        }
                    },
                    layout: {
                        padding: {
                            left: 20,
                            right: 20,
                            top: 10,
                            bottom: 10
                        }
                    },
                    scales: {
                        x: {
                            type: 'time', // X-axis as a time scale
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Date',
                                color: '#333', // Axis title color
                                font: {
                                    size: 14,
                                    family: 'Arial'
                                }
                            },
                            time: {
                                unit: 'day', // Display dates as days
                                tooltipFormat: 'MMM dd, yyyy', // Tooltip format for date
                                displayFormats: {
                                    day: 'MMM dd' // X-axis label format
                                }
                            },
                            grid: {
                                color: 'rgba(200, 200, 200, 0.2)' // Grid line color
                            },
                            ticks: {
                                color: '#555', // X-axis tick color
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            beginAtZero: false, // Don't force Y-axis to start at zero
                            title: {
                                display: true,
                                text: 'Count of Patients',
                                color: '#333',
                                font: {
                                    size: 14,
                                    family: 'Arial'
                                }
                            },
                            ticks: {
                                stepSize: 10,
                                color: '#555', // Y-axis tick color
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: 'rgba(200, 200, 200, 0.2)' // Grid line color
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
