import express from 'express';
import { getSupabase, getSupabaseAnon } from '../data/supabase.js';
import { issueSession, clearSession, toSessionUser } from '../middleware/supabase-session.js';
import { verifyPortfolioToken, NAMESPACE } from '../middleware/portfolio-auth.js';
import { sendError } from '../middleware/error-response.js';

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
 * Body: { email, password }
 *
 * Signs in through Supabase Auth and mirrors the session into httpOnly
 * cookies. Still throttled per email and per IP so the endpoint cannot be
 * used to brute-force a password through Supabase.
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

    const { data, error } = await getSupabaseAnon().auth.signInWithPassword({ email, password });

    if (error || !data?.session) {
      recordFailure(email, attemptsByEmail);
      recordFailure(ip, failuresByIp);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    clearFailures(email, attemptsByEmail);
    clearFailures(ip, failuresByIp);

    issueSession(res, NAMESPACE, {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    });

    return res.status(200).json({
      success: true,
      message: 'Signed in to the portfolio admin panel.',
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: toSessionUser(data.user)
    });
  } catch (err) {
    return sendError(res, err, 'Could not sign you in right now.');
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
  clearSession(res, NAMESPACE);
  res.status(200).json({ success: true, message: 'Signed out.' });
});

/**
 * PUT /api/portfolio/auth/password
 * Body: { currentPassword, newPassword }
 *
 * Supabase stores password hashes itself, so the current password is proved by
 * attempting a sign-in before the new one is written through the admin API.
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

    const { error: signInError } = await getSupabaseAnon().auth.signInWithPassword({
      email: req.portfolioAdmin.email,
      password: String(currentPassword)
    });

    if (signInError) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    const { error } = await getSupabase().auth.admin.updateUserById(req.portfolioAdmin.id, {
      password: String(newPassword)
    });

    if (error) {
      console.error('Supabase password update failed:', error);
      return res.status(500).json({ success: false, error: 'Could not update the password.' });
    }

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    return sendError(res, err, 'Could not update the password.');
  }
});

export default router;