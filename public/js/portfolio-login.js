import { api, setToken, getToken, redirectToLogin, DASHBOARD_URL } from './portfolio-common.js';

const form = document.getElementById('login-form');
const emailInput = document.getElementById('pf-email');
const passwordInput = document.getElementById('pf-password');
const showPassword = document.getElementById('pf-show-password');
const submitBtn = document.getElementById('pf-login-btn');
const btnLabel = document.getElementById('pf-btn-label');
const alertBox = document.getElementById('login-alert');
const alertText = document.getElementById('login-alert-text');

function showError(message) {
  alertText.textContent = message;
  alertBox.classList.add('show');
}

function hideError() {
  alertBox.classList.remove('show');
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnLabel.textContent = isLoading ? 'Signing in...' : 'Sign in';
}

showPassword?.addEventListener('change', () => {
  passwordInput.type = showPassword.checked ? 'text' : 'password';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideError();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError('Please enter both your email and password.');
    return;
  }

  setLoading(true);

  try {
    const result = await api('/api/portfolio/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false
    });

    setToken(result.token);
    try {
      localStorage.setItem('pf_admin_user', JSON.stringify(result.user));
    } catch (err) {
      /* ignore */
    }

    window.location.replace(DASHBOARD_URL);
  } catch (err) {
    showError(err.message || 'Could not sign you in.');
    setLoading(false);
  }
});

// Already signed in? Skip straight to the dashboard.
if (getToken()) {
  api('/api/portfolio/auth/me')
    .then(() => {
      window.location.replace(DASHBOARD_URL);
    })
    .catch(() => redirectToLogin());
}
