// Create the Chart.js graph
const ctx = document.getElementById("patientChart").getContext("2d");

// Create a gradient for the graph background
const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
gradientFill.addColorStop(0, "rgba(89, 141, 143,0.4)");
gradientFill.addColorStop(1, "rgba(89, 141, 143,0)");

// Initialize the Chart
let patientChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Patient Count",
            data: [],
            borderColor: "rgb(89, 141, 143)",
            backgroundColor: gradientFill,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "rgb(89, 141, 143)",
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
                        size:12
                    }
                }
            },
            tooltip: {
                backgroundColor: "rgba(89, 141, 143, 0.8)",
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
                    }
                    ,maxRotation: 45, // Maximum rotation in degrees
                    minRotation: 45 
                }
            },
            y: {
                grid: {
                    display: false // Disable grid lines on the y-axis
                },
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
        }
    }
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

        // Sort data by date (ascending)
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        const dates = sortedData.map(entry => entry.date);
        const counts = sortedData.map(entry => entry.count);

        updateGraph(dates, counts);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Update the Chart with new data
function updateGraph(dates, counts) {
    patientChart.data.labels = dates;
    patientChart.data.datasets[0].data = counts;
    patientChart.update();
}

// Retrieve Auth Token
function getAuthToken() {
    return localStorage.getItem("auth_token");
}

// Automatically Fetch Data on Page Load
window.onload = fetchData;
