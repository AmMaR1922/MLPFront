// DashLocal.js

// Localization data for different languages
const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        AddNewHospitalH2: "Add New Hospital",
        AddNewHospitalP: "Enter the hospital details below",
        HospitalNameLabel : "Hospital Name",
        CountryLabel : "Country",
        CityLabel : "City",
        AddressLabel : "Address",
        Dragdropyourfileshere: "Drag & drop your files here",
        orclicktobrowse : "or click to browse",
        AddHospitalButton: "Add Hospital",
        CancelButton: "Cancel"

        

    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
        AddNewHospitalH2: "اضافة مستشفي",
        AddNewHospitalP: " ادخل بيانات المستشفي في الاسفل",
        HospitalNameLabel : "اسم المستشفي",
        CountryLabel : "الدولة",
        CityLabel : "المدينة",
        AddressLabel : "العنوان",
        Dragdropyourfileshere: "قم بسحب وإسقاط ملفاتك هنا",
        orclicktobrowse : "أو انقر للتصفح",
        AddHospitalButton: "اضافه مستشفي",
        CancelButton: "الغاء"
        
    }
};

// Function to change the UI language
function changeLanguage() {

    
    const selectedLanguage =  localStorage.getItem('selectedLang'); // Get the selected language
    const buttons = document.querySelectorAll('.localizable-button');
    const translation = translations[selectedLanguage] || translations.en; // Default to English if no match

    // Update the UI text based on selected language
    document.getElementById("welcomeMessage").innerText = translation.welcomeMessage;
    document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
    document.getElementById("logoutButton").innerText = translation.logoutButton;

    document.getElementById("AddNewHospitalH2").innerText = translation.AddNewHospitalH2;
    document.getElementById("AddNewHospitalP").innerText = translation.AddNewHospitalP;
    document.getElementById("HospitalNameLabel").innerText = translation.HospitalNameLabel;
    document.getElementById("CityLabel").innerText = translation.CityLabel;
    document.getElementById("AddressLabel").innerText = translation.AddressLabel;
    document.getElementById("CountryLabel").innerText = translation.CountryLabel;
    document.getElementById("Dragdropyourfileshere").innerText = translation.Dragdropyourfileshere;
    document.getElementById("orclicktobrowse").innerText = translation.orclicktobrowse;
    document.getElementById("AddHospitalButton").innerText = translation.AddHospitalButton;
    document.getElementById("CancelButton").innerText = translation.CancelButton;



    

    
    

    


    // Save the selected language to localStorage
   
    updateUserInfo();
}

changeLanguage()


