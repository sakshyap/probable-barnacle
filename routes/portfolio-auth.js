import express from 'express';
import bcrypt from 'bcryptjs';
import { getPortfolioAdmin, updatePortfolioAdmin } from '../data/portfolio-db.js';
import {
  signPortfolioToken,
  verifyPortfolioToken,
  COOKIE_NAME
} from '../middleware/portfolio-auth.js';

const router = express.Router();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_PER_IP = 20;

const attemptsByEmail = new Map();
const failuresByIp = new Map();

function sweep(store, windowMs) {
  const cutoff = Date.now() - windowMs;
  for (const [key, entry] of store) {
    if (entry.firstAt < cutoff) store.delete(key);
  }
}

function isLocked(key, store, windowMs, max) {
  const entry = store.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > windowMs) {
    store.delete(key);
    return false;
  }
  return entry.count >= max;
}

function recordFailure(key, store) {
  const entry = store.get(key);
  if (entry) {
    entry.count += 1;
  } else {
    store.set(key, { count: 1, firstAt: Date.now() });
  }
}

function clearFailures(key, store) {
  store.delete(key);
}

setInterval(() => {
  sweep(attemptsByEmail, WINDOW_MS);
  sweep(failuresByIp, WINDOW_MS);
}, WINDOW_MS).unref();

/**
 * POST /api/portfolio/auth/login
 *
 * Throttled per email and per IP. The configured admin password is a short
 * numeric PIN, so without this the endpoint is brute-forceable.
 */
router.post('/login', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  try {
    if (isLocked(ip, failuresByIp, WINDOW_MS, MAX_FAILED_PER_IP)) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts from this network. Try again in 15 minutes.'
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    if (isLocked(email, attemptsByEmail, WINDOW_MS, MAX_ATTEMPTS)) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts for this account. Try again in 15 minutes.'
      });
    }

    const admin = getPortfolioAdmin();
    if (!admin) {
      return res.status(500).json({
        success: false,
        error: 'Portfolio admin is not configured in data/portfolio-db.json.'
      });
    }

    const emailMatches = (admin.email || '').toLowerCase() === email;
    const passwordMatches = await bcrypt.compare(password, admin.passwordHash || '');

    if (!emailMatches || !passwordMatches) {
      recordFailure(email, attemptsByEmail);
      recordFailure(ip, failuresByIp);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    clearFailures(email, attemptsByEmail);
    clearFailures(ip, failuresByIp);

    const token = signPortfolioToken(admin);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: 'Signed in to the portfolio admin panel.',
      token,
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
    });
  } catch (err) {
    console.error('Portfolio login error:', err);
    return res.status(500).json({ success: false, error: 'Could not sign you in right now.' });
  }
});

/**
 * GET /api/portfolio/auth/me
 */
router.get('/me', verifyPortfolioToken, (req, res) => {
  res.status(200).json({ success: true, user: req.portfolioAdmin });
});

/**
 * POST /api/portfolio/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.status(200).json({ success: true, message: 'Signed out.' });
});

/**
 * PUT /api/portfolio/auth/password
 * Body: { currentPassword, newPassword }
 */
router.put('/password', verifyPortfolioToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Both the current and the new password are required.'
      });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Choose a new password with at least 8 characters.'
      });
    }

    const admin = getPortfolioAdmin();
    const matches = await bcrypt.compare(String(currentPassword), admin?.passwordHash || '');
    if (!matches) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    const passwordHash = await bcrypt.hash(String(newPassword), 12);
    updatePortfolioAdmin({ passwordHash });

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Portfolio password change error:', err);
    return res.status(500).json({ success: false, error: 'Could not update the password.' });
  }
});

export default router;
