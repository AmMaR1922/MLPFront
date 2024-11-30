const translations = {
    en: {
        
        Name:"Name:",
        phoneNumber: "Phone Number:",
        Address:"Address:"
        
    },
    ar: {
       
        Name:":الاسم",
        phoneNumber: ":رقم الهاتف",
        Address:":العنوان",
        Sex:":الجنس",
        Select:"اختار",
        Male:"ذكر",
        Female:"انثي",
        Pregnant:":حامل",
        SelectForPregnant:"اختار",
        Yes:"نعم",
        No:"لا",
        NumberofBirths:":عدد مرات الحمل",
        Hospital:":المستشفي",
        SelectaHospital:"اختار مستشفي"
        
    }
};

// Function to change the UI language
function changeLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLang'); 
    const translation = translations[selectedLanguage] || translations.en; 
  
    document.getElementById("Name").innerText = translation.Name;
    document.getElementById("phoneNumber").innerText = translation.phoneNumber;
    document.getElementById("Address").innerText = translation.Address;
}
changeLanguage()