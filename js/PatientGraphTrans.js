const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        Username: "Username",
        Hospital: "Hospital",
        PatientInformation : "Patient Information",
        Action:"Action",
        AddPatient:"Add Patient",
        BackToDashboard:"Back To Dashboard",
        addViewPatientBtn: "add/ViewPatient",
        backToDashboardBtn: "back To Dashboard"

        // Add any other fields you want to translate
    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
        Hospital: "المستشفي",
        Action:"التحكم",
        delete:"حذف",
        PatientInformation : "بيانات المرضي",
        AddPatient: "أضافة مريض",
        BackToDashboard: "الرجوع الي الداشبورد",
        addViewPatientBtn:"عرض/اضافه مرضي",
        backToDashboardBtn: "العودة الي الداشبورد"



        // Add any other fields you want to translate
    }
};

// Function to change the UI language
function changeLanguage() {
    // Get the selected language from the dropdown
    const selectedLanguage = localStorage.getItem('selectedLang'); 

    
    // Get the translations based on the selected language
    const translation = translations[selectedLanguage] || translations.en;
   
    
    // Update the UI elements with the translated text
    // document.getElementById("viewBioTitle").innerText = translation.viewBioTitle || document.getElementById("viewBioTitle").innerText;
    document.getElementById("welcomeMessage").innerText = translation.welcomeMessage;
    document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
    document.getElementById("logoutButton").innerText = translation.logoutButton;
    // document.getElementById("Hospital").innerText = translation.Hospital;
    //document.getElementById("Action").innerText = translation.Action;
    document.getElementById("AddPatient").innerText = translation.AddPatient;
    document.getElementById("BackToDashboard").innerText = translation.BackToDashboard;
    document.getElementById("BackToDashboard").innerText = translation.BackToDashboard;
    //document.getElementById("BackToDashboardBtn").innerText = translation.BackToDashboardBtn;
    //document.getElementById("BackToPatientBtn").innerText = translation.BackToPatientBtn;







    
    
    // Save the selected language in localStorage
   
}

changeLanguage();

// Initialize language on page load based on localStorage

// Call the function to set the language on page load
