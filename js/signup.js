// signup.js
console.log('Signup script loaded');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginFormContainer = document.getElementById('loginFormContainer');
const signupFormContainer = document.getElementById('signupFormContainer');

function showLogin() {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginFormContainer.style.display = 'block';
    signupFormContainer.style.display = 'none';
    clearMessages();
}

function showSignup() {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';
    clearMessages();
}

loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);
document.getElementById('toSignup').addEventListener('click', showSignup);
document.getElementById('toLogin').addEventListener('click', showLogin);

// Show category select for earners with animation
document.getElementById('signupRole').addEventListener('change', (e) => {
    const categorySelect = document.getElementById('signupCategory');
    console.log('categorySelect element:', categorySelect);
    console.log('Role changed to', e.target.value);
    if (e.target.value === 'earner') {
        categorySelect.style.display = 'block';
        console.log('Set display block, current:', categorySelect.style.display);
    } else {
        categorySelect.style.display = 'none';
        console.log('Set display none, current:', categorySelect.style.display);
    }
});

// Password visibility toggles
function togglePasswordVisibility(targetId, btn) {
    const input = document.getElementById(targetId);
    if (!input) return;
    const eyeSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const eyeOffSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.86 21.86 0 0 1 5.06-6.06"></path><path d="M1 1l22 22"></path></svg>';
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = eyeOffSVG;
        btn.setAttribute('aria-label', 'Hide password');
    } else {
        input.type = 'password';
        btn.innerHTML = eyeSVG;
        btn.setAttribute('aria-label', 'Show password');
    }
}

// Handle clicks on the button or SVG inside it using closest()
document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.toggle-password');
    if (btn) {
        const target = btn.getAttribute('data-target');
        togglePasswordVisibility(target, btn);
    }
});

// Clear messages
function clearMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

// Show message
function showMessage(message, type = 'error') {
    clearMessages();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = message;
    document.querySelector('.container').prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 5000);
}

// Set loading state
function setLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        button.textContent = '';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = button === document.querySelector('#signupForm button[type="submit"]') ? 'Signup' : 'Login';
    }
}

// Backend URL
const BASE_URL = 'https://skilltobill-b.onrender.com/api/auth';

/* ===================== SIGNUP ===================== */
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Signup submit triggered');

    const submitBtn = e.target.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);

    const data = {
        name: document.getElementById('signupName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        phone: document.getElementById('signupPhone').value.trim(),
        password: document.getElementById('signupPassword').value,
        role: document.getElementById('signupRole').value
    };
        console.log('Signup data:', data);
        window.lastSignupData = data;

    if (data.role === 'earner') {
        data.category = document.getElementById('signupCategory').value;
    }

    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.password || !data.role) {
        showMessage('Please fill in all required fields');
        setLoading(submitBtn, false);
        return;
    }

    if (data.role === 'earner' && !data.category) {
        showMessage('Please select a category for earners');
        setLoading(submitBtn, false);
        return;
    }

    console.log('Signup data:', data);

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log('Signup:', res.status, result);

        if (!res.ok) {
            showMessage(result.message || result.error || 'Signup failed');
            setLoading(submitBtn, false);
            return;
        }

        console.log('Signup success, token:', result.token, 'user:', result.user);

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        showMessage('Signup successful! Redirecting...', 'success');

        setTimeout(() => {
            const href = result.user.role === 'client' ? 'client-dashboard.html' : 'earner-dashboard.html';
            console.log('Redirecting to', href);
            window.location.href = href;
        }, 1000);

    } catch (err) {
        console.error('Signup fetch error:', err);
        showMessage('Network error. Please check your connection.');
    } finally {
        setLoading(submitBtn, false);
    }
});

/* ===================== LOGIN ===================== */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);

    const data = {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
    };

    // Basic validation
    if (!data.email || !data.password) {
        showMessage('Please enter both email and password');
        setLoading(submitBtn, false);
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        console.log('Login:', res.status, result);

        if (!res.ok) {
            showMessage(result.message || result.error || 'Login failed');
            setLoading(submitBtn, false);
            return;
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        showMessage('Login successful! Redirecting...', 'success');

        setTimeout(() => {
            if (result.user.role === 'client') {
                window.location.href = 'client-dashboard.html';
            } else {
                window.location.href = 'earner-dashboard.html';
            }
        }, 1000);

    } catch (err) {
        console.error('Login fetch error:', err);
        showMessage('Network error. Please check your connection.');
    } finally {
        setLoading(submitBtn, false);
    }
});
