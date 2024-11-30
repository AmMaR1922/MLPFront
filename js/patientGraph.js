// Create the Chart.js graph
const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/'; // API endpoint for deleting a patient

const ctx = document.getElementById("patientChart").getContext("2d");
let chartData = []; // This will store the entire response data


// Create a gradient for the graph background
const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
gradientFill.addColorStop(0, "rgba(248, 104, 52,0.4)");
gradientFill.addColorStop(1, "rgba(248, 104, 52,0)");

let hospitals = [];

async function fetchHospitals() {
    const token = getAuthToken();
    const response = await fetch(hospitalsApiUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    hospitals = await response.json();
}

fetchHospitals();

function getHospitalName(hospitalId) {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital ? hospital.name : 'Unknown';
}

async function deletePatient(patientId) {
    const token = getAuthToken();
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
            fetchData();
        } else {
            const errorDetails = await response.json();
            alert(`Failed to delete patient: ${errorDetails.title}`);
        }
    } catch (error) {
        alert(`Request failed: ${error.message}`);
    }
}

// Initialize the Chart
let patientChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [], // X-axis labels (dates will be formatted here)
        datasets: [{
            label: "Patient Count",
            data: [], // Y-axis data (patient counts)
            borderColor: "rgba(248, 104, 52,0.8)",
            backgroundColor: gradientFill,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgba(248, 104, 52,1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 10,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true, // Keep the chart proportional
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: "rgba(248, 104, 52,1)",
                titleFont: {
                    size: 20
                },
                bodyFont: {
                    size: 15
                },
                cornerRadius: 4
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
                    text: "Count",
                    font: {
                        size: 14
                    }
                },
                ticks: {
                    font: {
                        size: 10
                    }
                }
            }
        },
        onClick: function (e) {
            const activePoints = patientChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
            if (activePoints.length) {
                const index = activePoints[0].index;
                const selectedDate = chartData[index].date;
                const patientsOnSelectedDate = chartData[index].patients;
                renderPatientTable(patientsOnSelectedDate,selectedDate);
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

// Fetch Data and Update Chart
async function fetchData() {
    const authToken = getAuthToken();
    if (!authToken) {
        alert("Authentication token is missing.");
        return;
    }

    try {
        const response = await fetch("https://anteshnatsh.tryasp.net/api/Patient/GetAllCritical", {
            method: "GET",
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch data.");

        const data = await response.json();
        chartData = data; // Store the full response data for later use

        // Sort data by date (ascending)
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        const dates = sortedData.map(entry => entry.date);
        const counts = sortedData.map(entry => entry.count);

        updateGraph(dates, counts);

        // Render the patient table for the first date by default
        const firstDatePatients = sortedData[0].patients;
        renderPatientTable(firstDatePatients,sortedData[0].date);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Update the Chart with new data
function updateGraph(dates, counts) {
    // Format dates to ensure proper parsing and display
    const formattedDates = dates.map(dateString => {
        const date = new Date(dateString); // Parse the date string into a Date object
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`; // Format to "DD MMM"
    });

    patientChart.data.labels = formattedDates; // Pass formatted dates to labels
    patientChart.data.datasets[0].data = counts; // Set patient counts
    patientChart.update();
}

// Render Patient List in Table
function renderPatientTable(patients,selectedDate) {
    const patientList = document.getElementById('patientList');
    document.getElementById('DateOfCritical').textContent = selectedDate;
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
                            <td>${getHospitalName(patient.hospitalId)} </td>
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

// Retrieve Auth Token
function getAuthToken() {
    return localStorage.getItem("auth_token");
}

// Initialize
fetchData();
