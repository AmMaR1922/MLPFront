// Localization data for different languages
const translations = {
    en: {
        AddBioH2: "Add Biological Indicators",
        sugarPercentageLabel: "Sugar Percentage:",
        bloodPressureLabel: "Blood Pressure:",
        averageTemperatureLabel: "Average Temperature:",
        dateLabel: "Date:",
        timeLabel: "Time:",
        submitButton: "Submit",
        // Other translations for dashboard
        
    },
    ar: {
        AddBioH2: "إضافة المؤشرات البيولوجية",
        sugarPercentageLabel: "نسبة السكر:",
        bloodPressureLabel: "ضغط الدم:",
        averageTemperatureLabel: "متوسط درجة الحرارة:",
        dateLabel: "التاريخ:",
        timeLabel: "الوقت:",
        submitButton: "إرسال",
        // Other translations for dashboard
        
    }
};

// Function to change the UI language based on the selected language in localStorage
function changeLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLang') || 'en'; // Default to English if not set
    const translation = translations[selectedLanguage]; // Get the translation for the selected language

    // Update the text of elements based on the selected language
    document.getElementById("AddBioH2").innerText = translation.AddBioH2;
    document.getElementById("sugarPercentageLabel").innerText = translation.sugarPercentageLabel;
    document.getElementById("bloodPressureLabel").innerText = translation.bloodPressureLabel;
    document.getElementById("averageTemperatureLabel").innerText = translation.averageTemperatureLabel;
    document.getElementById("dateLabel").innerText = translation.dateLabel;
    document.getElementById("timeLabel").innerText = translation.timeLabel;
    document.getElementById("submitButton").innerText = translation.submitButton;

    // Additional UI elements (for dashboard, if needed)
    

    // Save the selected language in localStorage
    localStorage.setItem('selectedLang', selectedLanguage);
}

// Call the function to set the language on page load
changeLanguage();
