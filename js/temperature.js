document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('AverageTempratureChart').getContext('2d');

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
            console.log("Fetched Patients:", patients);

            patients.sort((a, b) => {
                const bpA = a.lastBiologicalIndicator?.averageTemprature ?? 0;
                const bpB = b.lastBiologicalIndicator?.averageTemprature ?? 0;
                return bpB - bpA;
            });

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
                        <th>State</th>
                        <th>Hospital</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(patient => `
                        <tr>
                            <td>${patient.name}</td>
                            <td>${patient.lastBiologicalIndicator?.healthCondition || 'Unknown'}</td>
                            <td>${getHospitalName(patient.hospitalId)}</td>
                            <td>
                                <button id="AddBio" onclick="window.location.href='addBio.html?patientId=${patient.id}'">Add Bio</button>
                                <button id="ViewBio" onclick="window.location.href='viewBio.html?patientName=${patient.name}'">View Bio</button>
                                <button id="update" onclick="window.location.href='updatePatient.Html?patientId=${patient.id}'">Update</button>
                                <button id="delete" onclick="deletePatient('${patient.id}')">Delete</button>
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

            const { date, averageTemprature } = record;

            if (date && averageTemprature && averageTemprature > 37.1) {
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

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: 'Count of Patients with Avg Temp > 37.1',
                    data: counts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Patients with Avg Temperature > 37.1 by Date',
                        font: { size: 18 }
                    }
                },
                scales: {
                    x: {
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
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count of Patients'
                        }
                    }
                }
            }
        });
    }

    // Fetch data and initialize graph
    fetchPatients();
    createGraph();
});
