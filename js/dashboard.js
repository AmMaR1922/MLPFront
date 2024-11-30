document.addEventListener("DOMContentLoaded", () => {
    // Fetch and animate counts for patients and hospitals
    const fetchCounts = async () => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error("Auth token not found");
            document.getElementById("patientCount").innerText = "Unauthorized";
            document.getElementById("hospitalCount").innerText = "Unauthorized";
            document.getElementById("userCount").innerText = "Unauthorized";
            return;
        }

        try {
            // Fetch patient count
            const patientResponse = await fetch("https://anteshnatsh.tryasp.net/api/Patient/AllNames", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!patientResponse.ok) throw new Error("Failed to fetch patient names");

            const patientList = await patientResponse.json();
            const patientCount = Array.isArray(patientList) ? patientList.length : 0;
            countUp("patientCount", patientCount);
        } catch (error) {
            console.error("Error fetching patient count:", error);
            document.getElementById("patientCount").innerText = "Error";
        }

        try {
            // Fetch hospital count
            const hospitalResponse = await fetch("https://anteshnatsh.tryasp.net/api/Hospital/GetHospitals", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!hospitalResponse.ok) throw new Error("Failed to fetch hospitals");

            const hospitalList = await hospitalResponse.json();
            const hospitalCount = Array.isArray(hospitalList) ? hospitalList.length : 0;
            countUp("hospitalCount", hospitalCount);
        } catch (error) {
            console.error("Error fetching hospital count:", error);
            document.getElementById("hospitalCount").innerText = "Error";
        }


        try {
            // Fetch user count
            const userResponse = await fetch("https://anteshnatsh.tryasp.net/api/Account/GetAllUsers", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!userResponse.ok) throw new Error("Failed to fetch users");

            const userList = await userResponse.json();
            const userCount = Array.isArray(userList) ? userList.length : 0;
            countUp("userCount", userCount);
        } catch (error) {
            console.error("Error fetching user count:", error);
            document.getElementById("userCount").innerText = "Error";
        }
    };

    // Count-up animation function
    function countUp(elementId, targetNumber, duration = 3000) {
        const element = document.getElementById(elementId);
        const start = 0;
        const increment = targetNumber / (duration / 100);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            element.innerText = Math.floor(current); // Update the number
        }, 10);
    }

    // Run the fetchCounts function
    fetchCounts();

    // Update the year dynamically in the footer
    document.getElementById("currentYear").innerText = new Date().getFullYear();
});
function hideAdminCard() {
    var card = document.getElementById('AdminCard');
    
    // Retrieve user data from localStorage
    const userData = localStorage.getItem('user_data');
    
    // Check if user data exists
    if (userData) {
        try {
            // Parse the user data and check for role
            const { role } = JSON.parse(userData);
            
            // Log to check the role
            console.log("User role:", role);

            // Hide the card if the role is not Admin
            if (role !== "Admin") {
                console.log("Hiding Admin Card for non-admin user.");
                card.style.display = 'none';
            } else {
                card.style.display = 'block';  // Show the card if role is Admin
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    } else {
        console.log("User data not found in localStorage.");
        // Optionally, hide the card if no user data is found
        card.style.display = 'none';
    }
}

// Call the function to hide the Admin card
hideAdminCard();
