import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  removePost
} from '../data/portfolio-db.js';
import { verifyPortfolioToken, optionalPortfolioToken } from '../middleware/portfolio-auth.js';
import { sendError } from '../middleware/error-response.js';

const router = express.Router();

function validate(payload, { partial = false } = {}) {
  if (!partial) {
    if (!payload.title || !String(payload.title).trim()) return 'Post title is required.';
    if (!payload.content || !String(payload.content).trim()) return 'Post content is required.';
  } else {
    for (const field of ['title', 'content', 'author', 'category', 'excerpt']) {
      if (payload[field] !== undefined && !String(payload[field]).trim()) {
        return `Field "${field}" cannot be empty.`;
      }
    }
  }
  return null;
}

/**
 * GET /api/portfolio/blog
 * Public endpoint used by the portfolio Blog section. Only published posts
 * are returned unless the caller is an authenticated admin with ?drafts=1.
 */
router.get('/', optionalPortfolioToken, async (req, res) => {
  try {
    const wantsDrafts = req.query.drafts === '1' && req.portfolioAdmin;
    const posts = await getPosts({ includeDrafts: Boolean(wantsDrafts) });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve blog posts.');
  }
});

/**
 * GET /api/portfolio/blog/:id
 */
router.get('/:id', optionalPortfolioToken, async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: `No blog post with id "${req.params.id}".` });
    }
    if (post.status !== 'Published' && !req.portfolioAdmin) {
      return res.status(404).json({ success: false, error: 'That post is not published.' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve the blog post.');
  }
});

/**
 * POST /api/portfolio/blog
 */
router.post('/', verifyPortfolioToken, async (req, res) => {
  const body = req.body || {};
  const error = validate(body);
  if (error) return res.status(400).json({ success: false, error });

  try {
    res.status(201).json({ success: true, message: 'Blog post created', data: await createPost(body) });
  } catch (err) {
    sendError(res, err, 'Failed to create the blog post.');
  }
});

/**
 * PUT /api/portfolio/blog/:id
 */
router.put('/:id', verifyPortfolioToken, async (req, res) => {
  const body = req.body || {};
  const error = validate(body, { partial: true });
  if (error) return res.status(400).json({ success: false, error });

  try {
    const updated = await updatePost(req.params.id, body);
    if (!updated) {
      return res.status(404).json({ success: false, error: `No blog post with id "${req.params.id}".` });
    }

    res.status(200).json({ success: true, message: 'Blog post updated', data: updated });
  } catch (err) {
    sendError(res, err, 'Failed to update the blog post.');
  }
});

/**
 * DELETE /api/portfolio/blog/:id
 */
router.delete('/:id', verifyPortfolioToken, async (req, res) => {
  try {
    const removed = await removePost(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, error: `No blog post with id "${req.params.id}".` });
    }
    res.status(200).json({ success: true, message: 'Blog post deleted' });
  } catch (err) {
    sendError(res, err, 'Failed to delete the blog post.');
  }
});

export default router;
