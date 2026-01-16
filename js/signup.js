import { registerUser, loginUser } from './utils/api.js';

console.log('Signup script loaded');

// ===== Tabs =====
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

// ===== Category select for earners =====
document.getElementById('signupRole').addEventListener('change', (e) => {
    const categorySelect = document.getElementById('signupCategory');
    if (e.target.value === 'earner') {
        categorySelect.style.display = 'block';
    } else {
        categorySelect.style.display = 'none';
    }
});

// ===== Password toggle =====
function togglePasswordVisibility(targetId, btn) {
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
    } else {
        input.type = 'password';
        btn.textContent = 'Show';
    }
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.toggle-password');
    if (btn) {
        const target = btn.getAttribute('data-target');
        togglePasswordVisibility(target, btn);
    }
});

// ===== Messages =====
function clearMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

function showMessage(message, type = 'error') {
    clearMessages();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = message;
    document.querySelector('.container').prepend(msgDiv);
    setTimeout(() => msgDiv.remove(), 5000);
}

// ===== Loading state =====
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

// ===== SIGNUP =====
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);

    const data = {
        name: document.getElementById('signupName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        phone: document.getElementById('signupPhone').value.trim(),
        password: document.getElementById('signupPassword').value,
        role: document.getElementById('signupRole').value
    };

    if (data.role === 'earner') {
        data.category = document.getElementById('signupCategory').value;
    }

    // Validation
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

    try {
        const result = await registerUser(data);
        console.log('Signup success', result);

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        showMessage('Signup successful! Redirecting...', 'success');

        setTimeout(() => {
            const href = result.user.role === 'client' ? 'client-dashboard.html' : 'earner-dashboard.html';
            window.location.href = href;
        }, 1000);

    } catch (err) {
        console.error('Signup error', err);
        showMessage(err.message || 'Network error. Please check your connection.');
    } finally {
        setLoading(submitBtn, false);
    }
});

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);

    const data = {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
    };

    if (!data.email || !data.password) {
        showMessage('Please enter both email and password');
        setLoading(submitBtn, false);
        return;
    }

    try {
        const result = await loginUser(data);
        console.log('Login success', result);

        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        showMessage('Login successful! Redirecting...', 'success');

        setTimeout(() => {
            const href = result.user.role === 'client' ? 'client-dashboard.html' : 'earner-dashboard.html';
            window.location.href = href;
        }, 1000);

    } catch (err) {
        console.error('Login error', err);
        showMessage(err.message || 'Network error. Please check your connection.');
    } finally {
        setLoading(submitBtn, false);
    }
});
