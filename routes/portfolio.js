import express from 'express';
import { getPublicContent, getPosts } from '../data/portfolio-db.js';
import { optionalPortfolioToken } from '../middleware/portfolio-auth.js';
import { sendError } from '../middleware/error-response.js';

const router = express.Router();

/**
 * GET /api/portfolio/content
 *
 * A single round trip for everything the public portfolio renders.
 * Add ?drafts=1 (with an admin session) to also receive unpublished posts.
 */
router.get('/content', optionalPortfolioToken, async (req, res) => {
  try {
    const content = await getPublicContent();

    if (req.query.drafts === '1' && req.portfolioAdmin) {
      content.posts = await getPosts({ includeDrafts: true });
    }

    res.status(200).json({ success: true, data: content });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve the portfolio content.');
  }
});

export default router;