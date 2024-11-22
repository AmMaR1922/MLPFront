const endpoint = "https://anteshnatsh.tryasp.net/api/Patient/AllNames";
const token = localStorage.getItem("auth_token");
const chartsContainer = document.getElementById("charts-container");

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html"; // Redirect to the dashboard page
});

document.getElementById("refreshBtn").addEventListener("click", () => {
    loadPatientData();
});

async function loadPatientData() {
    try {
        // Clear previous charts
        chartsContainer.innerHTML = "";

        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch patient data");
        }

        const patients = await response.json();

        patients.forEach((patient, index) => {
            createChart(patient.name, index);
        });
    } catch (error) {
        console.error(error);
        alert("Error loading patient data.");
    }
}

function createChart(patientName, index) {
    // Create a card for each patient
    const card = document.createElement("div");
    card.className = "chart-card";

    // Add title
    const title = document.createElement("h2");
    title.textContent = `Patient: ${patientName}`;
    card.appendChild(title);

    // Add canvas for chart
    const canvas = document.createElement("canvas");
    canvas.id = `chart-${index}`;
    card.appendChild(canvas);

    // Append card to container
    chartsContainer.appendChild(card);

    // Generate random temperature data
    const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 6) + 35); // Random temperatures between 35-40
    const labels = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);

    // Create the chart
    new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: data,
                    borderColor: "#1b4525",
                    backgroundColor: "#62a572",
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
        },
    });
}

// Load data on page load
loadPatientData();
