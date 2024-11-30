// DashLocal.js

// Localization data for different languages
const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        totalPatientsTitle: "Total Patients",
        totalHospitalsTitle: "Total Hospitals",
        footerMessage: "Health Dashboard. All rights reserved.",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        totalPatientsTitle: "إجمالي المرضى",
        totalHospitalsTitle: "إجمالي المستشفيات",
        footerMessage: "لوحة تحكم الصحة. جميع الحقوق محفوظة.",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
    }
};

// Function to change the UI language
function changeLanguage() {
    const selectedLanguage =  localStorage.getItem('selectedLang'); // Get the selected language
    const translation = translations[selectedLanguage] || translations.en; // Default to English if no match

    // Update the UI text based on selected language
    document.getElementById("welcomeMessage").innerText = translation.welcomeMessage;
    document.getElementById("totalPatientsTitle").innerText = translation.totalPatientsTitle;
    document.getElementById("totalHospitalsTitle").innerText = translation.totalHospitalsTitle;
    document.getElementById("footerMessage").innerText = translation.footerMessage;
    document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
    document.getElementById("logoutButton").innerText = translation.logoutButton;

    // Save the selected language to localStorage
   
    updateUserInfo();
}
changeLanguage()


