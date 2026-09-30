import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'pf_admin_token';
const LOCAL_STORAGE_KEY = 'pf_admin_token';
const TOKEN_SCOPE = 'portfolio-admin';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set. Copy .env.example to .env and set a strong value.');
  }
  return secret;
}

function readToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  if (req.headers.cookie) {
    const cookie = req.headers.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE_NAME}=`));
    if (cookie) return decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1));
  }

  return null;
}

function sendUnauthorized(req, res) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: a valid portfolio admin token is required.'
    });
  }
  return res.redirect('/portfolio-admin/login');
}

/**
 * Guards the portfolio admin panel.
 *
 * Uses its own cookie/storage namespace (pf_admin_token) and a distinct JWT
 * `scope` claim, so a token minted for the legacy students/courses panel can
 * never be replayed against this one or vice versa.
 */
export function verifyPortfolioToken(req, res, next) {
  const token = readToken(req);

  if (!token) {
    return sendUnauthorized(req, res);
  }

  try {
    const decoded = jwt.verify(token, getSecret());
    if (decoded.scope !== TOKEN_SCOPE) {
      return sendUnauthorized(req, res);
    }
    req.portfolioAdmin = decoded;
    return next();
  } catch (err) {
    return sendUnauthorized(req, res);
  }
}

/**
 * Issues a portfolio-scoped token. Throws if JWT_SECRET is missing so the app
 * fails at login time rather than silently signing with a hardcoded default.
 */
export function signPortfolioToken(admin, expiresIn = '8h') {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role || TOKEN_SCOPE,
      scope: TOKEN_SCOPE
    },
    getSecret(),
    { expiresIn }
  );
}

export { COOKIE_NAME, LOCAL_STORAGE_KEY, TOKEN_SCOPE };
