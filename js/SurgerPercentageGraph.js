document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('SugarPercentageChart').getContext('2d');

    // Get the token from localStorage
    function getToken() {
        return localStorage.getItem('auth_token');
    }

    const token = getToken(); // Get token from localStorage
    const allBiologicalIndicatorsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/GetAllBiologicalIndicator'; // API endpoint
    const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
    const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
    const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/'; // API endpoint for deleting a patient
    let hospitals = [];



    // Fetch hospitals and store them globally
    async function fetchHospitals() {
        try {
            const response = await fetch(hospitalsApiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Error fetching hospitals: ${response.status}`);
            hospitals = await response.json();
            console.log("Fetched Hospitals:", hospitals);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    }

    // Fetch and display patients after hospitals data is loaded
    async function fetchPatients() {
        await fetchHospitals(); // Ensure hospitals are fetched first
    
        try {
            const response = await fetch(allPatientsApiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (!response.ok) throw new Error(`Error fetching patients: ${response.status}`);
            const patients = await response.json();
    
            // Sort patients by sugar percentage in descending order
            patients.sort((a, b) => {
                const spA = a.lastBiologicalIndicator?.sugarPercentage ?? 0;
                const spB = b.lastBiologicalIndicator?.sugarPercentage ?? 0;
                return spB - spA; // Higher sugar first
            });

            
    
            // Render the sorted patients
            renderPatients(patients);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
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
                    const isUnspecified = condition === 'Moderate';

                    return `
                    <tr style="
                    ${isAtRisk ? 'background-color: rgba(248,104,52,0.15);' : ''}
                    ${isHealthy ? ' background-color: rgba(0, 252, 122, 0.1);' : ''}
                    ${isUnspecified ? ' background-color: rgb(0, 0, 0);' : ''}

                    ">
   
                            <td>${patient.name}</td>
                            <td>${getHospitalName(patient.hospitalId)}</td>
                            <td>
                                <button id="AddBioSugar" onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                                <button id="ViewBioSugar" onclick="window.location.href='viewBio.html?patientName=${patient.name}&patientAge=${patient.age}'">View Bio</button>
                                <button id="updateSugar" onclick="window.location.href='updatePatient.Html?patientId=${patient.id}'">Update</button>
                                <button id="deleteSugar" onclick="deletePatient('${patient.id}')">Delete</button>
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
        `;
    }

    // Categorize sugar percentage
    function getSugarCondition(sugarPercentage) {
        if (sugarPercentage < 100) return "Healthy";
        if (sugarPercentage >= 100 && sugarPercentage <= 125) return "Moderate";
        return "At Risk";
    }

    // Get the hospital name based on hospitalId
    function getHospitalName(hospitalId) {
        const hospital = hospitals.find(h => h.id === hospitalId);
        return hospital ? hospital.name : 'Unknown';
    }

    // Delete the patient using the API
    async function deletePatient(patientId) {
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

    // Fetch biological indicators from API
    async function fetchBiologicalIndicators() {
        try {
            const response = await fetch(allBiologicalIndicatorsApiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
            const data = await response.json();
            console.log("Biological Indicators Data:", data);
            return data;
        } catch (error) {
            console.error('Error fetching biological indicators:', error);
            return [];
        }
    }

    // Process data for graph
    async function processGraphData() {
        const data = await fetchBiologicalIndicators();
        const dateCounts = {};

        data.forEach(record => {
            console.log("Processing Record:", record);

            const { date, sugarPercentage } = record;

            if (date && sugarPercentage && sugarPercentage > 125) {
                if (!dateCounts[date]) {
                    dateCounts[date] = 0;
                }
                dateCounts[date]++;
            } else {
                console.warn("Skipped Record (Invalid Data):", record);
            }
        });

        const sortedDateCounts = Object.entries(dateCounts)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const timeLabels = sortedDateCounts.map(item => item[0]);
        const counts = sortedDateCounts.map(item => item[1]);

        return { timeLabels, counts };
    }

    // Create graph using Chart.js
    async function createGraph() {
        const { timeLabels, counts } = await processGraphData();

        console.log("Time Labels:", timeLabels);
        console.log("Counts:", counts);

        if (!timeLabels.length || !counts.length) {
            console.error("No data available to display in the graph.");
            return;
        }
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
        gradientFill.addColorStop(0, "rgba(248, 104, 52,0.4)");
        gradientFill.addColorStop(1, "rgba(248, 104, 52,0)");

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Patients with Sugar % > 125',
                    data: counts,
                    borderColor: "rgba(248, 104, 52,0.8)",
                    backgroundColor: gradientFill,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "rgba(248, 104, 52,1)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 10,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Patients with Sugar Percentage > 125 by Date',
                        font: { size: 18 }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false // Disable grid lines on the x-axis
                        },
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MMM dd, yyyy'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Count of Patients'
                        }
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
    }

    // Fetch data and initialize graph
    fetchPatients();
    createGraph();
});
