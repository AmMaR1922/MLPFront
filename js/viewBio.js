// Extract patient name from the URL
function getPatientNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('patientName');
}

const patientName = getPatientNameFromUrl(); // Get patient name from URL
const token = localStorage.getItem('authToken'); // Get auth token from localStorage
const getBioApiUrl = `https://anteshnatsh.tryasp.net/api/Patient/${patientName}`; // API endpoint

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
            return;
        }

        const bioDataList = await response.json();
        renderBioData(bioDataList);

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
                    <th>Health Condition Score</th>
                    <th>Health Condition</th>
                    <th>Sugar Percentage</th>
                    <th>Blood Pressure</th>
                    <th>Average Temperature</th>
                    <th>Date</th>
                    <th>Time</th>
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
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    bioListContainer.innerHTML = tableHTML;
}

// Initialize the page
fetchAndDisplayBioData();
