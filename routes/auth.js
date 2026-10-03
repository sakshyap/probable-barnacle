import express from 'express';
import { getSupabaseAnon } from '../data/supabase.js';
import { issueSession, clearSession, toSessionUser } from '../middleware/supabase-session.js';
import { verifyToken } from '../middleware/auth.js';
import { sendError } from '../middleware/error-response.js';

const router = express.Router();

const NAMESPACE = 'admin';

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Signs in through Supabase Auth and returns the access token, which the
 * admin panel stores in localStorage and sends back as a Bearer header.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const { data, error } = await getSupabaseAnon().auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: String(password)
    });

    if (error || !data?.session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    issueSession(res, NAMESPACE, {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: toSessionUser(data.user)
    });
  } catch (err) {
    return sendError(res, err, 'An internal server error occurred while processing login.');
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  clearSession(res, NAMESPACE);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export default router;