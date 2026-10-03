import { resolveSession, toSessionUser } from './supabase-session.js';

/**
 * Protects the legacy students/courses admin API.
 *
 * Sessions are Supabase Auth access tokens. Any confirmed Supabase user is
 * treated as an admin - the project only ever has one operator. See
 * README.md ("Restricting who can sign in") if you need a tighter rule.
 */
export async function verifyToken(req, res, next) {
  const user = await resolveSession(req, res, 'admin');

  if (!user) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Access denied. Please sign in again.'
      });
    }
    return res.redirect('/admin');
  }

  req.user = toSessionUser(user);
  return next();
}