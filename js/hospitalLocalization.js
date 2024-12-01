// DashLocal.js

// Localization data for different languages
const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        ImageLocalization: "Image",
        NameLocalization: "Name",
        AddressLocalization: "Address",
        CityLocalization : "City",
        CountryLocalization: "Country",
        ActionLocalization : "Action",
        AddNewHospitalBtn: "Add new hospital",
        HospitalListH1 : "Hospital List",
        UpdateHospitalButton: "Update",
        DeleteHospitalButton : "Delete"

    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
        ImageLocalization: "الصورة",
        NameLocalization: "الاسم",
        AddressLocalization: "العنوان",
        CityLocalization : "المدينة",
        CountryLocalization: "الدولة",
        ActionLocalization : "التحكم",
        AddNewHospitalBtn : "اضافة مستشفي",
        HospitalListH1 : "قائمة المستشفيات",
        UpdateHospitalButton: "تعديل",
        DeleteHospitalButton : "حذف"
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

    document.getElementById("ImageLocalization").innerText = translation.ImageLocalization;
    document.getElementById("NameLocalization").innerText = translation.NameLocalization;
    document.getElementById("AddressLocalization").innerText = translation.AddressLocalization;
    document.getElementById("CityLocalization").innerText = translation.CityLocalization;
    document.getElementById("CountryLocalization").innerText = translation.CountryLocalization;
    document.getElementById("ActionLocalization").innerText = translation.ActionLocalization;
    document.getElementById("AddNewHospitalBtn").innerText = translation.AddNewHospitalBtn;
    document.getElementById("HospitalListH1").innerText = translation.HospitalListH1;
    // document.getElementById("UpdateHospitalButton").innerText = translation.UpdateHospitalButton;
    // document.getElementById("DeleteHospitalButton").innerText = translation.DeleteHospitalButton;

    
    buttons.forEach(button => {
        key = button.getAttribute('data-key');
       button.textContent = translation[key];
    });


    // Save the selected language to localStorage
   
    updateUserInfo();
}


