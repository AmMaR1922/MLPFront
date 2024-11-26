document.addEventListener("DOMContentLoaded", () => {
    // Fetch and animate counts for patients and hospitals
    const fetchCounts = async () => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            console.error("Auth token not found");
            document.getElementById("patientCount").innerText = "Unauthorized";
            document.getElementById("hospitalCount").innerText = "Unauthorized";
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
