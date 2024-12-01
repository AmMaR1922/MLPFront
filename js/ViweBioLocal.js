const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        bioDataHeading: "Bio Data for Patient",
        PatientDataAgeText: "Years Old",
        backToPatientButton: "Back to patient",
        HCS:"Health Condition Score",
        HC:"Health Condition",
        SP:"Sugar Percentage",
        BP:"Blood Pressure",
        AT:"Average Temperature",
        Date:"Date",
        Time:"Time",
         Action:"Action",
         delete:"Delete",
        // Add any other fields you want to translate
    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
        bioDataHeading: "بيانات السيرة الذاتية للمريض",
        PatientDataAgeText: "السن",
        backToPatientButton: "الرجوع إلى المريض",
        HCS:"نسبه الحاله الصحيه",
        HC:"الصحيه الحاله",
        SP:"نسبه السكر",
        BP:"ضغط الدم",
        AT:"متوسط درجه الحراره",
        Date:"التاريخ",
        Time:"الوقت",
        Action:"التحكم",
        delete:"حذف"

        // Add any other fields you want to translate
    }
};

// Function to change the UI language
function changeLanguage() {
    // Get the selected language from the dropdown
    const selectedLanguage = localStorage.getItem('selectedLang'); 
    const buttons = document.querySelectorAll('.delete-button');

  
    
    // Get the translations based on the selected language
    const translation = translations[selectedLanguage] || translations.en;
   
    
    // Update the UI elements with the translated text
    document.getElementById("viewBioTitle").innerText = translation.viewBioTitle || document.getElementById("viewBioTitle").innerText;
    document.getElementById("welcomeMessage").innerText = translation.welcomeMessage;
    document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
    document.getElementById("logoutButton").innerText = translation.logoutButton;
    document.getElementById("bioDataHeading").innerText = translation.bioDataHeading;
    document.getElementById("PatientDataAgeText").innerText = translation.PatientDataAgeText;
    document.getElementById("backToPatientButton").innerText = translation.backToPatientButton;
    document.getElementById("HCS").innerText = translation.HCS;
    document.getElementById("SP").innerText = translation.SP;
    document.getElementById("HC").innerText = translation.HC;
    document.getElementById("BP").innerText = translation.BP;
    document.getElementById("AT").innerText = translation.AT;
    document.getElementById("Date").innerText = translation.Date;
    document.getElementById("Time").innerText = translation.Time;
    document.getElementById("Action").innerText = translation.Action;
    buttons.forEach(button => {
        key = button.getAttribute('data-key');
       button.textContent =translation[key];
   });


    
    
    // Save the selected language in localStorage
   
}
// Initialize language on page load based on localStorage

// Call the function to set the language on page load
