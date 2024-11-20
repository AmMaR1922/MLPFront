document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('lucide-eye');
        icon.classList.toggle('lucide-eye-off');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        try {
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="lucide-loader-2"></i> Signing in...';
            submitButton.disabled = true;

            const credentials = { email, password };
            const response = await loginUser(credentials);

            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }

            window.location.href = './DashBoard.html';
        } catch (error) {
            errorMessage.textContent = error.message || 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
            
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Restore remember me preference
    const remembered = localStorage.getItem('rememberMe');
    if (remembered) {
        document.getElementById('remember').checked = true;
    }

    // Add input animations
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('input-focused');
        });
    });
});