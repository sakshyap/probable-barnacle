import { getSupabase, verifyAccessToken } from '../data/supabase.js';

// ---------------------------------------------------------------------------
// Cookie names. The two admin panels keep separate namespaces so a session
// minted for one can never be replayed against the other.
// ---------------------------------------------------------------------------
const NAMESPACES = {
  admin: { access: 'admin_token', refresh: 'admin_refresh_token' },
  portfolio: { access: 'pf_admin_token', refresh: 'pf_refresh_token' }
};

const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const BASE_COOKIE = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/'
};

function readCookie(req, name) {
  if (!req.headers.cookie) return null;

  const cookie = req.headers.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function cookiesFor(namespace) {
  return NAMESPACES[namespace];
}

/**
 * Mirrors the Supabase session into httpOnly cookies so a reload keeps the
 * admin signed in even though the token in localStorage may have expired.
 */
export function issueSession(res, namespace, { token, refreshToken }) {
  const names = cookiesFor(namespace);

  res.cookie(names.access, token, { ...BASE_COOKIE, maxAge: ACCESS_COOKIE_MAX_AGE });
  if (refreshToken) {
    res.cookie(names.refresh, refreshToken, { ...BASE_COOKIE, maxAge: REFRESH_COOKIE_MAX_AGE });
  }

  // Lets the browser refresh its localStorage copy without a code change.
  res.setHeader('X-Refreshed-Token', token);
}

export function clearSession(res, namespace) {
  const names = cookiesFor(namespace);
  res.clearCookie(names.access, { path: '/' });
  res.clearCookie(names.refresh, { path: '/' });
  res.removeHeader('X-Refreshed-Token');
}

function accessTokenFrom(req, namespace) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return readCookie(req, cookiesFor(namespace).access);
}

/**
 * Resolves the signed-in Supabase user for a request, or null.
 *
 * A valid access token short-circuits. When the token has expired - Supabase
 * access tokens live about an hour - the refresh cookie is exchanged for a new
 * one, the new token is pushed to the browser in `X-Refreshed-Token`, and the
 * request proceeds normally. Without this an admin would be logged out every
 * hour mid-edit.
 */
export async function resolveSession(req, res, namespace) {
  const token = accessTokenFrom(req, namespace);
  if (token) {
    const user = await verifyAccessToken(token);
    if (user) return user;
  }

  const refreshToken = readCookie(req, cookiesFor(namespace).refresh);
  if (!refreshToken) return null;

  // A misconfigured environment must surface as "not signed in" rather than an
  // unhandled rejection - the route handler still returns a clean 401/503.
  try {
    const { data, error } = await getSupabase().auth.refreshSession(refreshToken);
    if (error || !data?.session) return null;

    issueSession(res, namespace, {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    });

    return data.user;
  } catch (err) {
    console.error('Session refresh failed:', err);
    return null;
  }
}

/**
 * The shape the admin front-ends already expect from a user object.
 */
export function toSessionUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name:
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      (user.email ? user.email.split('@')[0] : 'Admin'),
    role: user.user_metadata?.role || 'admin'
  };
}

export { NAMESPACES };