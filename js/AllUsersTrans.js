const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        Username: "Username",
        Hospital: "Hospoital",
        Email: "Email",
        Action:"Action",
        delete:"Delete",
        UsersData: "Users Data",
        AddUser : "AddUser"
        // Add any other fields you want to translate
    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
        Username: "اسم المستخدم",
        Hospital: "المستشفي",
        Email: "البريد الالكتروني",
        Action:"التحكم",
        delete:"حذف",
        UsersData: "بيانات المستخدمين",
        AddUser : "اضافة مستخدم"

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
    document.getElementById("Username").innerText = translation.Username;
    document.getElementById("Email").innerText = translation.Email;
    document.getElementById("Hospital").innerText = translation.Hospital;
    document.getElementById("Action").innerText = translation.Action;
    document.getElementById("UsersData").innerText = translation.UsersData;
    document.getElementById("AddUser").innerText = translation.AddUser;





    
    
    // Save the selected language in localStorage
   
}
changeLanguage();

// Initialize language on page load based on localStorage

// Call the function to set the language on page load
