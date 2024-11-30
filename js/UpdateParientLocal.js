const translations = {
    en: {
        
        Name:"Name",
        
    },
    ar: {
       
        Name:"الاسم",
        
    }
};

// Function to change the UI language
function changeLanguage() {
    const selectedLanguage = localStorage.getItem('selectedLang'); 
    const translation = translations[selectedLanguage] || translations.en; 
  
    document.getElementById("Name").innerText = translation.Name;

    buttons.forEach(button => {
         key = button.getAttribute('data-key');
        button.textContent =translation[key];
    });


 document.getElementById("AddPatient").innerText = translation.AddPatient;
 document.getElementById("BackDash").innerText = translation.BackDash;


    document.getElementById("hospitalNameHeader").innerText = translation.hospitalNameHeader;
    document.getElementById("logoutButton").innerText = translation.logoutButton;
    document.getElementById("Table1").innerText = translation.Table1;

    // Save the selected language to localStorage
    
    updateUserInfo();
}
changeLanguage()