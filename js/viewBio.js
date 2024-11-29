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
        console.log("Bio Data List:", bioDataList);

        renderBioData(bioDataList);

    } catch (error) {
        console.error('Request Error:', error);
        alert(`Request failed: ${error.message}`);
    }
}

// Function to delete a bio entry by ID
async function deleteBio(bioId) {
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
                    <th>Health Condition Score</th>
                    <th>Health Condition</th>
                    <th>Sugar Percentage</th>
                    <th>Blood Pressure</th>
                    <th>Average Temperature</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th> <!-- Added actions column for Delete button -->
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
                    <button class="delete-button" onclick="deleteBio(${bio.id})">Delete</button>
                </td>
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
