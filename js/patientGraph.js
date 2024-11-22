document.getElementById("bloodPressureBtn").addEventListener("click", function () {
    alert("Navigating to Blood Pressure details...");
});

document.getElementById("sugarPercentageBtn").addEventListener("click", function () {
    alert("Navigating to Sugar Percentage details...");
});

document.getElementById("temperatureBtn").addEventListener("click", function () {
    alert("Navigating to Temperature details...");
});

document.getElementById("backToDashboardBtn").addEventListener("click", function () {
    window.location.href = "dashboard.html"; // Adjust to the correct path of your dashboard
});

document.getElementById("addViewPatientBtn").addEventListener("click", function () {
    window.location.href = "addViewPatient.html"; // Adjust to the correct path
});
