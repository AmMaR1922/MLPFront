document.addEventListener('DOMContentLoaded', function () {
    // API URLs
    const allBiologicalIndicatorsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/GetAllBiologicalIndicator';
    const hospitalsApiUrl = 'https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals';
    const allPatientsApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/AllNames';
    const deletePatientApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeletePatient/';
    let hospitals = [];

    const ctx = document.getElementById('AverageTempratureChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(248, 104, 52, 0.5)');
    gradient.addColorStop(1, 'rgba(248, 104, 52, 0)');

    // Utility function to get token
    function getToken() {
        return localStorage.getItem('auth_token');
    }

    const token = getToken();

    // Fetch hospitals
    async function fetchHospitals() {
        try {
            const response = await fetch(hospitalsApiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Error fetching hospitals: ${response.status}`);
            hospitals = await response.json();
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    }

    // Fetch patients
    async function fetchPatients() {
        await fetchHospitals();
        try {
            const response = await fetch(allPatientsApiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Error fetching patients: ${response.status}`);
            const patients = await response.json();
            renderPatients(patients);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    }

    // Render patients in the table
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
                    const isModerate = condition === 'Moderate';

                    return `
                        <tr style="${isAtRisk ? 'background-color: rgba(248,104,52,0.15);' : ''} 
                                     ${isHealthy ? ' background-color: rgba(0, 252, 122, 0.1);' : ''}
                                     ">
                            <td>${patient.name}</td>
                            <td>${getHospitalName(patient.hospitalId)}</td>
                            <td>
                                <button class="addBio" data-patient-id="${patient.id}">Add Bio</button>
                                <button class="viewBio" data-patient-name="${patient.name}">View Bio</button>
                                <button class="update" data-patient-id="${patient.id}">Update</button>
                                <button class="delete" data-patient-id="${patient.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
                </tbody>
            </table>
        `;

        // Attach event listeners to buttons dynamically
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const patientId = button.getAttribute('data-patient-id');
                showModal('Are you sure you want to delete this patient?', function() {
                    deletePatient(patientId);
                });
            });
        });

        document.querySelectorAll('.update').forEach(button => {
            button.addEventListener('click', function() {
                const patientId = button.getAttribute('data-patient-id');
                showModal('Are you sure you want to update this patient?', function() {
                    window.location.href = `updatePatient.Html?patientId=${patientId}`;
                });
            });
        });

        document.querySelectorAll('.addBio').forEach(button => {
            button.addEventListener('click', function() {
                const patientId = button.getAttribute('data-patient-id');
                window.location.href = `addBio.html?patientId=${patientId}`;
            });
        });

        document.querySelectorAll('.viewBio').forEach(button => {
            button.addEventListener('click', function() {
                const patientName = button.getAttribute('data-patient-name');
                window.location.href = `viewBio.html?patientName=${patientName}`;
            });
        });
    }

    // Get hospital name by ID
    function getHospitalName(hospitalId) {
        const hospital = hospitals.find(h => h.id === hospitalId);
        return hospital ? hospital.name : 'Unknown';
    }

    // Show Modal
    function showModal(message, onConfirm) {
        modalMessage.textContent = message;
        modal.style.display = "block";

        confirmBtn.onclick = function () {
            onConfirm();
            closeModal();
        };

        cancelBtn.onclick = function () {
            closeModal();
        };
    }

    // Close Modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Confirm delete patient
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

    // Fetch biological indicators
    async function fetchBiologicalIndicators() {
        try {
            const response = await fetch(allBiologicalIndicatorsApiUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
            const data = await response.json();
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
        const patientData = {};

        data.forEach(record => {
            const { date, averageTemprature, name, healthCondition, hospitalId } = record;
            if (date && averageTemprature > 37.1) {
                const formattedDate = new Date(date).toISOString().split('T')[0];
                dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;

                if (!patientData[formattedDate]) {
                    patientData[formattedDate] = [];
                }
                patientData[formattedDate].push({ name, healthCondition, hospitalId });
            }
        });

        const sortedDateCounts = Object.entries(dateCounts)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        return {
            timeLabels: sortedDateCounts.map(item => item[0]),
            counts: sortedDateCounts.map(item => item[1]),
            patientData
        };
    }

    // Create graph
    async function createGraph() {
        const { timeLabels, counts } = await processGraphData();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Count',
                    data: counts,
                    borderColor: "rgba(248, 104, 52,0.8)",
                    backgroundColor: gradient,
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
                plugins: {
                    title: {
                        display: true,
                        text: 'Patients with Avg Temperature '
                    },
                    font: {
                        size: 20, // Font size
                        weight: 'bold', // Font weight
                        family: 'Arial' // Font family
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false // Disable grid lines on the x-axis
                        },
                        type: 'time',
                        title: {
                            display: true,
                            text: 'Date',
                            font: {
                                weight: 'bold', // Make the font bold
                                size: 14 // Optional: Adjust font size
                            },
                            color: '#f4531880' // Set to a suitable color (e.g., dark gray)
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Count of Patients',
                            font: {
                                weight: 'bold', // Make the font bold
                                size: 14 // Optional: Adjust font size
                            },
                            color: '#f8683480' // Set to a suitable color (e.g., blue)
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
    ]});
    }

    // Modal Elements
    const modal = document.getElementById("modal");
    const closeBtn = document.querySelector(".close");
    const confirmBtn = document.getElementById("modal-confirm");
    const cancelBtn = document.getElementById("modal-cancel");
    const modalMessage = document.getElementById("modal-message");

    // Close modal when clicking on the close button
    closeBtn.addEventListener('click', closeModal);

    // Fetch initial data
    fetchPatients();
    createGraph();
});
