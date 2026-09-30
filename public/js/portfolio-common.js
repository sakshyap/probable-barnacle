/**
 * Shared helpers for the portfolio admin panel.
 *
 * The token is kept in localStorage (mirrored into an httpOnly cookie by the
 * server) so an XSS-free page reload keeps the session, and a 401 from any
 * request immediately bounces the user back to the login screen.
 */

export const TOKEN_KEY = 'pf_admin_token';
export const DASHBOARD_URL = '/portfolio-admin/dashboard';
export const LOGIN_URL = '/portfolio-admin/login';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch (err) {
    return '';
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    /* storage unavailable - the httpOnly cookie still carries the session */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('pf_admin_user');
  } catch (err) {
    /* ignore */
  }
}

export function redirectToLogin() {
  clearToken();
  window.location.replace(LOGIN_URL);
}

/**
 * Thin fetch wrapper that attaches the bearer token and handles 401 globally.
 * Returns the parsed JSON body and throws an Error carrying `.status` and
 * `.payload` so callers can show a useful message.
 */
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'same-origin',
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  if (response.status === 401 && auth) {
    redirectToLogin();
    throw new Error('Session expired. Please sign in again.');
  }

  if (!response.ok) {
    const error = new Error(payload?.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

// ---------------- DOM helpers ----------------

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value !== null && value !== undefined && value !== false) {
      node.setAttribute(key, value);
    }
  }

  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }

  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

// ---------------- Toasts ----------------

let toastStack = null;

export function toast(message, kind = 'success') {
  if (!toastStack) {
    toastStack = el('div', { class: 'pf-toast-stack' });
    document.body.appendChild(toastStack);
  }

  const node = el('div', {
    class: `pf-toast pf-toast-${kind === 'error' ? 'error' : 'success'}`,
    text: message
  });

  toastStack.appendChild(node);
  setTimeout(() => {
    node.style.opacity = '0';
    node.style.transition = 'opacity .25s';
    setTimeout(() => node.remove(), 250);
  }, 3600);
}

// ---------------- Formatting ----------------

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Turns a textarea of comma or newline separated values into a clean array.
 */
export function parseList(value) {
  if (Array.isArray(value)) return value;
  return String(value ?? '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toListText(value) {
  return Array.isArray(value) ? value.join('\n') : String(value ?? '');
}

/**
 * Splits a repeatable field on blank lines: "Name | role\nOther | role2".
 * Used by the highlights/stats repeaters on the profile form.
 */
export function parsePairs(value) {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split('|');
      return { left: left.trim(), right: rest.join('|').trim() };
    });
}

export function confirmAction(message) {
  return window.confirm(message);
}
