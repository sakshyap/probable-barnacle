/**
 * Admin Authentication Script
 * Handles login submission, JWT storage, and auto-redirect
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const showPasswordCheckbox = document.getElementById('show-password');
  const loginBtn = document.getElementById('login-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const alertBox = document.getElementById('login-alert');
  const alertMessage = document.getElementById('alert-message');

  // If token already exists in localStorage, check if it is still valid
  const existingToken = localStorage.getItem('admin_token');
  if (existingToken) {
    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${existingToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/admin/dashboard';
        } else {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      });
  }

  // Quick autofill when clicking demo credentials box
  const demoCredsBox = document.getElementById('demo-creds');
  if (demoCredsBox) {
    demoCredsBox.addEventListener('click', () => {
      emailInput.value = 'admin@example.com';
      passwordInput.value = 'admin123';
      hideError();
      passwordInput.focus();
    });
  }

  // Toggle password visibility
  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', () => {
      passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
    });
  }

  // Display error alert
  function showError(msg) {
    alertMessage.textContent = msg;
    alertBox.classList.add('show');
  }

  function hideError() {
    alertBox.classList.remove('show');
  }

  // Form submit handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError('Please fill in both email and password.');
      return;
    }

    // Set loading state
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.success && result.token) {
        // Store JWT token and user info
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', JSON.stringify(result.user));

        // The session cookies are set by the server as httpOnly.
        window.location.href = '/admin/dashboard';
      } else {
        showError(result.error || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login network error:', err);
      showError('Cannot connect to the server. Please check your network.');
    } finally {
      loginBtn.disabled = false;
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
    }
  });
});
