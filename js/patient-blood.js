const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/';
const criticalPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/GetAllCritical';
let hospitals = [];

const canvas = document.getElementById('bloodPressureChart');
const ctx = canvas.getContext('2d');

// Create a gradient for the background
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(248, 104, 52, 0.5)');
gradient.addColorStop(1, 'rgba(248, 104, 52, 0)');

// Utility: Format date to "22 Nov"
function formatDate(dateString) {
    const date = new Date(dateString); // Parse the date string into a Date object
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`; 
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
    await fetchHospitals();
    const token = getToken();
    const response = await fetch(allPatientsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const patients = await response.json();

    patients.sort((a, b) => {
        const bpA = a.lastBiologicalIndicator?.bloodPressure ?? 0;
        const bpB = b.lastBiologicalIndicator?.bloodPressure ?? 0;
        return bpB - bpA;
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
                    return `
                    <tr style="${isAtRisk ? 'background-color: rgba(248,104,52,0.15);' : ''}
                    
                    ${isHealthy ? ' background-color: rgba(0, 252, 122, 0.1);' : ''}
                    ">
                        <td>${patient.name}</td>
                        <td>${getHospitalName(patient.hospitalId)}</td>
                        <td>
                            <button onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                            <button id="ViewBio" onclick="window.location.href='viewBio.html?patientName=${patient.name}&patientAge=${patient.age}'">View Bio</button>
                            <button onclick="window.location.href='updatePatient.html?patientId=${patient.id}'">Update</button>
                            <button onclick="deletePatient('${patient.id}')">Delete</button>
                        </td>
                    </tr>`;
                }).join('')}
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

// Blood Pressure Chart
document.addEventListener('DOMContentLoaded', function () {
    const token = getToken();

    fetch(criticalPatientsApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const dateCounts = {};

                data.forEach(item => {
                    const date = formatDate(item.date); // Format date here
                    const patients = item.patients;
                    const highBPCount = patients.filter(patient => patient.lastBiologicalIndicator.bloodPressure > 120).length;

                    if (highBPCount > 0) {
                        dateCounts[date] = highBPCount;
                    }
                });

                const sortedDateCounts = Object.entries(dateCounts)
                    .sort((a, b) => new Date(a[0]) - new Date(b[0]));

                const timeLabels = sortedDateCounts.map(item => item[0]);
                const counts = sortedDateCounts.map(item => item[1]);

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: timeLabels,
                        datasets: [{
                            label: 'Count',
                            data: counts,
                            borderColor: 'rgba(248, 104, 52, 0.8)',
                            backgroundColor: gradient,
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true,
                            pointBackgroundColor: "rgba(248, 104, 52,1)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 10,
                            
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Blood Pressure Trends Over Time',
                                color: '#333',
                                font: {
                                    size: 20,
                                    weight: 'bold',
                                    family: 'Arial'
                                },
                            },
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false // Disable grid lines on the x-axis
                                },
                                title: {
                                    display: true,
                                    text: "Date",
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Count of Patients with High BP',
                                },
                                min: 0,
                            }
                        }
                    }
                    ,plugins: [
                        {
                            id: 'hoverLine',
                            afterDraw: (chart) => {
                                const { ctx, tooltip } = chart;
                                if (!tooltip || tooltip.opacity === 0) return;
                
                                const activePoint = tooltip.dataPoints[0];
                                if (!activePoint) return;
                
                                const x = activePoint.element.x;
                                const y = activePoint.element.y;
                                const chartArea = chart.chartArea;
                
                                // Draw the line from the hovered point to the x-axis
                                ctx.save();
                                ctx.beginPath();
                                ctx.moveTo(x, y);
                                ctx.lineTo(x, chartArea.bottom);
                                ctx.strokeStyle = 'rgba(248, 104, 52,1)';
                                ctx.lineWidth = 2;
                                ctx.stroke();
                                ctx.restore();
                            }
                        }
                    ]
                });
            } else {
                alert('No critical patients data found.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
