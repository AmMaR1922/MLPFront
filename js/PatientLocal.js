const translations = {
    en: {
        welcomeMessage: "Welcome, ",
        sidebar1: "Critical Graph",
        sidebar2: "Temperature",
        sidebar3:"Blood Pressure",
        sidebar4:"Sugar Percentage",
        hospitalNameHeader: "Loading...",
        logoutButton: "Logout",
        Name:"Name",
        Actions:"Actions",
        AddBio:"AddBio",
        ViewBio:"ViewBio",
        update:"Update",
        delete:"Delete",
        BackDash:"Back to Dashboard",
        AddPatient:"Add Patient",
        Hospital:"Hospital",
        Table1:"Patient Information"
    },
    ar: {
        welcomeMessage: "أهلاً وسهلاً، ",
        sidebar1: "رسم بياني حاسم",
        sidebar2: "درجه الحراره",
        sidebar3:"ضغظ الدم",
        sidebar4:"نسبه السكر",
        Name:"الاسم",
        Hospital:"المستشفي",
        Actions:"التحكم",
        AddBio:"اضافه تحليل",
        ViewBio:"رؤيه التحاليل",
        update:"تحديث",
        delete:"حذف",
        BackDash:"الرجوع الي القائمه",
        AddPatient:"اضافه مريض",
        hospitalNameHeader: "جارٍ التحميل...",
        logoutButton: "تسجيل الخروج",
        Table1:"معلومات المريض "
    }
};

// Function to change the UI language
function changeLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLang'); 
    const buttons = document.querySelectorAll('.localizable-button');
    const translation = translations[selectedLanguage] || translations.en; 
    document.getElementById("welcomeMessage").innerText = translation.welcomeMessage;
    document.getElementById("sidebar1").innerHTML =  '<i class="fas fa-chart-line"></i>'+translation.sidebar1;
    document.getElementById("sidebar2").innerHTML = ' <i class="fa fa-thermometer-half"></i>'+translation.sidebar2;
    document.getElementById("sidebar3").innerHTML = ' <i class="fa fa-tint"></i>'+translation.sidebar3;
    document.getElementById("sidebar4").innerHTML = '<i class="fa fa-syringe"></i>'+translation.sidebar4;
    document.getElementById("Table1").innerText = translation.Table1;
    document.getElementById("Name").innerText = translation.Name;
    document.getElementById("Hospital").innerText = translation.Hospital;
    document.getElementById("Actions").innerText = translation.Actions;


    buttons.forEach(button => {
         key = button.getAttribute('data-key');
        button.textContent =translation[key];
    });


 document.getElementById("AddPatient").innerText = translation.AddPatient;
 document.getElementById("BackDash").innerText = translation.BackDash;
document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
document.getElementById("logoutButton").innerText = translation.logoutButton;
   


    // Save the selected language to localStorage
    
    updateUserInfo();
}
