import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT authentication token
 * Protects admin API routes and redirects unauthorized page requests to /admin
 */
export function verifyToken(req, res, next) {
  let token = null;

  // 1. Check Authorization header (Format: Bearer <token>)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Check token in cookies if present
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith('admin_token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }

  // 3. Fallback: check query parameter ?token=
  if (!token && req.query.token) {
    token = req.query.token;
  }

  // If no token is provided
  if (!token) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Access denied. Please provide a valid Bearer token.'
      });
    }
    return res.redirect('/admin');
  }

  // Verify token
  try {
    const secret = process.env.JWT_SECRET || 'supersecret_admin_jwt_key_2026_change_in_production';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired token. Please log in again.'
      });
    }
    return res.redirect('/admin');
  }
}
