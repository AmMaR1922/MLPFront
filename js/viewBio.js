// Extract patient name from the URL
function getPatientNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('patientName');
}

function getPatientAgeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('patientAge');
}

const patientName = getPatientNameFromUrl(); // Get patient name from URL
const patientAge = getPatientAgeFromUrl();

const token = localStorage.getItem('auth_token'); // Get auth token from localStorage
const getBioApiUrl = `https://anteshnatsh.tryasp.net/api/Patient/${patientName}`; // API endpoint
const deleteBioApiUrl = 'https://anteshnatsh.tryasp.net/api/Patient/DeleteBio/'; // Delete Bio endpoint

document.getElementById('PatientDataName').textContent = patientName;
document.getElementById('PatientDataAge').textContent = patientAge;





// Function to fetch and display all bio entries for the patient
async function fetchAndDisplayBioData() {
    try {
        const response = await fetch(getBioApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error:', errorDetails);
            alert(`Failed to fetch bio data: ${errorDetails.title}`);
            console.log(token);
            console.error(`Error: ${response.status} ${response.statusText}`);
            alert(`Failed to fetch bio data: ${response.statusText}`);
            return;
        }

        const bioDataList = await response.json();
        console.log("Original Bio Data List:", bioDataList);

        // Sort by `date` (ascending order, from oldest to newest)
        const sortedBioDataList = bioDataList.sort((a, b) => {
            return   new Date(b.date)-new Date(a.date);
        });

        console.log("Sorted Bio Data List by Date:", sortedBioDataList);

        renderBioData(sortedBioDataList);

    } catch (error) {
        console.error('Request Error:', error);
        alert(`Request failed: ${error.message}`);
    }
}


// Function to delete a bio entry by ID
async function deleteBio(bioId) {

      // Show a confirmation alert
      const confirmation = confirm('Are you sure you want to delete this bio entry?');
    
      if (!confirmation) {
          // If the user cancels, exit the function
          return;
      }
    const url = `${deleteBioApiUrl}${bioId}`;
    try {
        const response = await fetch(url, {
            method: 'POST', // Assuming DELETE method might be blocked, using POST as provided
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Bio entry deleted successfully.');
            fetchAndDisplayBioData(); // Refresh the table
        } else {
            const errorDetails = await response.json();
            console.error('Error:', errorDetails);
            alert(`Failed to delete bio entry: ${errorDetails.title}`);
        }
    } catch (error) {
        console.error('Request Error:', error);
        alert(`Request failed: ${error.message}`);
    }
}

// Function to render the bio data in a table format
function renderBioData(bioDataList) {
    const bioListContainer = document.getElementById('bioList');

    if (bioDataList.length === 0) {
        bioListContainer.innerHTML = '<p>No bio data found for this patient.</p>';
        return;
    }

    let tableHTML = `
        <table class="bio-table">
            <thead>
                <tr>
                    <th id="HCS" >Health Condition Score</th>
                    <th id="HC">Health Condition</th>
                    <th id ="SP">Sugar Percentage</th>
                    <th id="BP">Blood Pressure</th>
                    <th id="AT">Average Temperature</th>
                    <th id="Date">Date</th>
                    <th id="Time">Time</th>
                    <th id="Action">Actions</th> <!-- Added actions column for Delete button -->
                </tr>
            </thead>
            <tbody>
    `;

    bioDataList.forEach(bio => {
        tableHTML += `
            <tr>
                <td>${bio.healthConditionScore}</td>
                <td>${bio.healthCondition}</td>
                <td>${bio.sugarPercentage}</td>
                <td>${bio.bloodPressure}</td>
                <td>${bio.averageTemprature}</td>
                <td>${bio.date}</td>
                <td>${bio.time}</td>
                <td>
                    <button class="delete-button"  data-key="delete" onclick="deleteBio(${bio.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    bioListContainer.innerHTML = tableHTML;
    changeLanguage();
}

// Initialize the page
fetchAndDisplayBioData();













 




document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('auth_token');
    const patientName = new URLSearchParams(window.location.search).get('patientName');
    const patientAge = new URLSearchParams(window.location.search).get('patientAge');
    const getBioApiUrl = `https://anteshnatsh.tryasp.net/api/Patient/${patientName}`;

    document.getElementById('PatientDataName').textContent = patientName;
    document.getElementById('PatientDataAge').textContent = patientAge;

    const ctx = document.getElementById('SpecificPatientChart').getContext('2d'); // Ensure the canvas exists

    if (!ctx) {
        console.error('Canvas not found or unable to get context.');
        return;
    }

    fetch(getBioApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to fetch data:', response.statusText);
            alert(`Failed to fetch bio data: ${response.statusText}`);
            return;
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data); // Check structure of data

        // Prepare data for the chart
        if (Array.isArray(data) && data.length > 0) {
            const bioIds = data.map(item => item.bioId); // Use bioId for data points
            const dates = data.map(item => item.date); // Assuming the data contains a 'date' field
            const sugarPercentageData = data.map(item => item.sugarPercentage);
            const bloodPressureData = data.map(item => item.bloodPressure);
            const temperatureData = data.map(item => item.averageTemprature || null); // Fallback if no temperature data

            // Check if we have all necessary data for the chart
            console.log('BioIds:', bioIds);
            console.log('Dates:', dates);
            console.log('Sugar Percentage:', sugarPercentageData);
            console.log('Blood Pressure:', bloodPressureData);
            console.log('Temperature Data:', temperatureData);

            // Create a gradient for the blood pressure line
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(248, 104, 52, 0.2)');
            gradient.addColorStop(1, 'rgba(248, 104, 52, 0)');

            // Create the chart
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates, // Use the date for the x-axis
                    datasets: [
                        {
                            label: 'Sugar Percentage (%)',
                            data: sugarPercentageData,
                            borderColor: 'rgba(40, 167, 69, 0.8)', // Green for sugar percentage
                            backgroundColor: 'rgba(40, 167, 69, 0.2)', // Light green
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3,
                            pointBackgroundColor: "rgba(40, 167, 69,1)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 10,
                        },
                        {
                            label: 'Blood Pressure (mmHg)',
                            data: bloodPressureData,
                            borderColor: 'rgba(248, 104, 52, 0.8)', // Orange for BP
                            backgroundColor: gradient,
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3,
                            pointBackgroundColor: "rgba(248, 104, 52,1)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 10,
                        },
                        {
                            label: 'Temperature (°C)',
                            data: temperatureData,
                            borderColor: 'rgba(0, 123, 255, 0.8)', // Blue for temperature
                            backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3,
                            pointBackgroundColor: "rgba(0, 123, 255,1)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 10,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Health Metrics Over Time',
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
                                display: false
                            },
                            title: {
                                display: true,
                                text: "Date", // Now showing date on x-axis
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Metric Values',
                            },
                            min: 0,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    }
                }
            });
        } else {
            console.error('No valid data found.');
            alert('No valid patient data to display.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});











// Show the confirmation modal
function showConfirmationModal(callback) {
    const modal = document.getElementById('confirmationModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');

    // Display the modal
    modal.style.display = 'flex';

    // Handle the confirm button click
    confirmBtn.onclick = function() {
        callback(); // Execute the provided callback function (e.g., delete the bio entry)
        modal.style.display = 'none'; // Close the modal
    };

    // Handle the cancel button click
    cancelBtn.onclick = function() {
        modal.style.display = 'none'; // Close the modal
    };
}

// Example usage for deleting a bio entry
async function deleteBio(bioId) {
    showConfirmationModal(async function() {
        const url = `${deleteBioApiUrl}${bioId}`;
        try {
            const response = await fetch(url, {
                method: 'POST', // Assuming DELETE method might be blocked, using POST as provided
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Bio entry deleted successfully.');
                fetchAndDisplayBioData(); // Refresh the table
            } else {
                const errorDetails = await response.json();
                console.error('Error:', errorDetails);
                alert(`Failed to delete bio entry: ${errorDetails.title}`);
            }
        } catch (error) {
            console.error('Request Error:', error);
            alert(`Request failed: ${error.message}`);
        }
    });
}
