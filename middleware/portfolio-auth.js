import { resolveSession, toSessionUser } from './supabase-session.js';

const NAMESPACE = 'portfolio';

// Mirrors the keys the admin panel uses in localStorage.
const COOKIE_NAME = 'pf_admin_token';
const LOCAL_STORAGE_KEY = 'pf_admin_token';

/**
 * Guards the portfolio admin panel.
 *
 * Shares the Supabase user pool with the legacy panel but keeps its own cookie
 * namespace, so signing out of one panel does not disturb the other.
 */
export async function verifyPortfolioToken(req, res, next) {
  const user = await resolveSession(req, res, NAMESPACE);

  if (!user) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: a valid portfolio admin session is required.'
      });
    }
    return res.redirect('/portfolio-admin/login');
  }

  req.portfolioAdmin = toSessionUser(user);
  return next();
}

/**
 * Attaches req.portfolioAdmin when a session is present but never rejects the
 * request. Lets the public content endpoint reveal drafts to a signed-in admin
 * while staying fully public for everyone else.
 */
export async function optionalPortfolioToken(req, res, next) {
  const user = await resolveSession(req, res, NAMESPACE);
  if (user) {
    req.portfolioAdmin = toSessionUser(user);
  }
  return next();
}

export { COOKIE_NAME, LOCAL_STORAGE_KEY, NAMESPACE };