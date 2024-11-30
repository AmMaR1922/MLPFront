const translations = {
    en: {
        
        Name:"Name:",
        phoneNumber: "Phone Number:",
        Address:"Address:",
        Sex:"Sex:",
        Select:"Select",
        Male:"Male",
        Female:"Female",
        Pregnant:"Pregnant:",
        SelectForPregnant:"Select",
        Yes:"Yes",
        No:"No", 
        NumberofBirths:"Number of Births:" ,
        Hospital:"Hospital:",
        SelectaHospital:"Select a Hospital",
        UpdatePatient:"Update Patient",
        UPI:"Update Patient Information",
        UP:"Update Patient"

        
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
        SelectaHospital:"اختار مستشفي",
        UpdatePatient:"تحديث المريض",
        UPI:"تحدبث بيانات المريض",
        UP:"تحديث المريض"

        
    }
};

// Function to change the UI language
function changeLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLang'); 
    const translation = translations[selectedLanguage] || translations.en; 
  
    document.getElementById("Name").innerText = translation.Name;
    document.getElementById("phoneNumber").innerText = translation.phoneNumber;
    document.getElementById("Address").innerText = translation.Address;
    document.getElementById("Sex").innerText = translation.Sex;
    document.getElementById("Select").innerText = translation.Select;
    document.getElementById("Male").innerText = translation.Male;
    document.getElementById("Female").innerText = translation.Female;
    document.getElementById("Pregnant").innerText = translation.Pregnant;
    document.getElementById("Yes").innerText = translation.Yes;
    document.getElementById("No").innerText = translation.No;
    document.getElementById("NumberofBirths").innerText = translation.NumberofBirths;
    document.getElementById("Hospital").innerText = translation.Hospital;
    document.getElementById("UpdatePatient").innerText = translation.UpdatePatient;
    document.getElementById("UPI").innerText = translation.UPI;
    document.getElementById("UP").innerText = translation.UP;

}
changeLanguage()