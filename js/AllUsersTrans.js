const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        Action:"Action",
        delete:"Delete",
        // Add any other fields you want to translate
    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
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
    // document.getElementById("viewBioTitle").innerText = translation.viewBioTitle || document.getElementById("viewBioTitle").innerText;
    document.getElementById("welcomeMessage").innerText = translation.welcomeMessage;
    document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
    document.getElementById("logoutButton").innerText = translation.logoutButton;

    document.getElementById("Action").innerText = translation.Action;
    buttons.forEach(button => {
        key = button.getAttribute('data-key');
       button.textContent =translation[key];
   });


    
    
    // Save the selected language in localStorage
   
}

// Initialize language on page load based on localStorage

// Call the function to set the language on page load
