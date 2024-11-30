const translations = {
    en: {
        AddNewPatient:"Add New Patient",
        SavePatient:"Save Patient",
        Name:"Name:",
        phoneNumber:"phone Number:",
        address:"Address:",
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
        Btpl:"Back to Patient List"
        
      
    },
    ar: {
        AddNewPatient:"اضافه مريض جديد",
        SavePatient:"حفظ المريض",
        Name:":الاسم",
        phoneNumber:":رقم الهاتف",
        address:":العنوان",
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
        Btpl:"العوده الي قائمه المرضي"

       
    }
};

// Function to change the UI language
function changeLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLang'); 
    const translation = translations[selectedLanguage] || translations.en; 
    document.getElementById("AddNewPatient").innerText = translation.AddNewPatient;
    document.getElementById("SavePatient").innerText = translation.SavePatient;
    document.getElementById("Name").innerText = translation.Name;
    document.getElementById("phoneNumber").innerText = translation.phoneNumber;
    document.getElementById("address").innerText = translation.address;
    document.getElementById("Sex").innerText = translation.Sex;
    document.getElementById("Select").innerText = translation.Select;
    document.getElementById("Male").innerText = translation.Male;
    document.getElementById("Female").innerText = translation.Female;
    document.getElementById("Pregnant").innerText = translation.Pregnant;
    document.getElementById("SelectForPregnant").innerText = translation.SelectForPregnant;
    document.getElementById("Yes").innerText = translation.Yes;
    document.getElementById("No").innerText = translation.No;
    document.getElementById("NumberofBirths").innerText = translation.NumberofBirths;
    document.getElementById("Hospital").innerText = translation.Hospital;
    document.getElementById("SelectaHospital").innerText = translation.SelectaHospital;
    document.getElementById("SelectaHospital").innerText = translation.SelectaHospital;
    document.getElementById("Btpl").innerText = translation.Btpl;


}
changeLanguage()