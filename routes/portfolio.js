import express from 'express';
import jwt from 'jsonwebtoken';
import { getPublicContent, getPosts } from '../data/portfolio-db.js';
import { TOKEN_SCOPE } from '../middleware/portfolio-auth.js';

const router = express.Router();

/**
 * Attaches req.portfolioAdmin when a valid token is present, but never rejects
 * the request. Lets the public content endpoint reveal drafts to a signed-in
 * admin while staying fully public for everyone else.
 */
function optionalPortfolioToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || !process.env.JWT_SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7).trim(), process.env.JWT_SECRET);
    if (decoded.scope === TOKEN_SCOPE) {
      req.portfolioAdmin = decoded;
    }
  } catch (err) {
    // An invalid token simply means "treat this as a public request".
  }

  return next();
}

/**
 * GET /api/portfolio/content
 *
 * A single round trip for everything the public portfolio renders.
 * Add ?drafts=1 (with an admin token) to also receive unpublished posts.
 */
router.get('/content', optionalPortfolioToken, (req, res) => {
  const content = getPublicContent();

  if (req.query.drafts === '1' && req.portfolioAdmin) {
    content.posts = getPosts({ includeDrafts: true });
  }

  res.status(200).json({ success: true, data: content });
});

export default router;
