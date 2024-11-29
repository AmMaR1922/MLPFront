// Import the language data (you could also fetch it from a separate file if needed)
import { langData } from './langData.js';

// Default language set to English
let currentLang = 'en';

// Function to change the language
function changeLanguage(lang) {
    const data = langData[lang];
    document.getElementById('login-title').innerText = data.title;
    document.getElementById('login-subtitle').innerText = data.subtitle;
    document.getElementById('email-label').innerText = data.emailLabel;
    document.getElementById('password-label').innerText = data.passwordLabel;
    document.getElementById('forgot-password-link').innerText = data.forgotPassword;
    document.getElementById('remember-text').innerText = data.rememberMe;
    document.getElementById('sign-in-text').innerText = data.signInText;

    // Update the button text
    document.getElementById('lang-toggle-btn').innerText = data.langButtonText;

    // Switch the language direction for Arabic (RTL)
    if (lang === 'ar') {
        document.documentElement.lang = 'ar';
        document.body.classList.add('rtl');
    } else {
        document.documentElement.lang = 'en';
        document.body.classList.remove('rtl');
    }
}

// Toggle the language on button click
document.getElementById('lang-toggle-btn').addEventListener('click', function () {
    // Toggle between languages
    if (currentLang === 'en') {
        currentLang = 'ar';
        this.classList.add('active');  // Add active class for Arabic
    } else {
        currentLang = 'en';
        this.classList.remove('active');  // Remove active class for English
    }

    changeLanguage(currentLang);
});

// Load the default language (English)
changeLanguage(currentLang);
