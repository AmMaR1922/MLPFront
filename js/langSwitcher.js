// Default language set to English
let currentLang = 'en';

// Function to load language data (fetch from centralized JSON)
async function loadLanguageData(lang) {
    const response = await fetch('js/langData.json'); // Update path to your langData.json
    const langData = await response.json();
    return langData[lang];
}

// Function to change the language dynamically
async function changeLanguage(lang) {
    const data = await loadLanguageData(lang);

    // Update the login page text
    document.getElementById('login-title').innerText = data.login.title;
    document.getElementById('login-subtitle').innerText = data.login.subtitle;
    document.getElementById('email-label').innerText = data.login.emailLabel;
    document.getElementById('password-label').innerText = data.login.passwordLabel;
    document.getElementById('forgot-password-link').innerText = data.login.forgotPassword;
    document.getElementById('remember-text').innerText = data.login.rememberMe;
    document.getElementById('sign-in-text').innerText = data.login.signInText;

    // Update the language toggle button
    document.getElementById('lang-toggle-btn').innerText = data.langButtonText;

    // Switch to Arabic (RTL) if needed
    if (lang === 'ar') {
        document.documentElement.lang = 'ar';
        document.body.classList.add('rtl');
    } else {
        document.documentElement.lang = 'en';
        document.body.classList.remove('rtl');
    }
}

// Event listener for language toggle button
document.getElementById('lang-toggle-btn').addEventListener('click', function () {
    currentLang = currentLang === 'en' ? 'ar' : 'en'; // Toggle language
    changeLanguage(currentLang);
});

// Load the default language (English) on page load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
});
