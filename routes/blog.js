import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  removePost
} from '../data/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/blog
 * Returns the list of all blog posts (Publicly readable for portfolio)
 */
router.get('/', (req, res) => {
  try {
    const posts = getAllPosts();
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve blog posts.' });
  }
});

/**
 * GET /api/blog/:id
 * Returns a single blog post by ID (Publicly readable)
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const post = getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: `Blog post with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve blog post.' });
  }
});

/**
 * POST /api/blog
 * Creates a new blog post (Protected by JWT)
 * Body: { title, author, category, excerpt, content, imageUrl, status }
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, author, category, excerpt, content, imageUrl, status } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Post title is required.' });
    }
    if (!author || !author.trim()) {
      return res.status(400).json({ success: false, error: 'Post author is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, error: 'Post category is required.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Post content is required.' });
    }

    const validStatus = status === 'Draft' ? 'Draft' : 'Published';

    const newPost = createPost({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      excerpt: excerpt ? excerpt.trim() : '',
      content: content.trim(),
      imageUrl: imageUrl ? imageUrl.trim() : '',
      status: validStatus
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost
    });
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ success: false, error: 'Failed to create blog post.' });
  }
});

/**
 * PUT /api/blog/:id
 * Updates an existing blog post (Protected by JWT)
 * Body: { title, author, category, excerpt, content, imageUrl, status }
 */
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = getPostById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Blog post with ID "${id}" was not found.`
      });
    }

    const { title, author, category, excerpt, content, imageUrl, status } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ success: false, error: 'Post title cannot be empty.' });
    }
    if (author !== undefined && !author.trim()) {
      return res.status(400).json({ success: false, error: 'Post author cannot be empty.' });
    }
    if (category !== undefined && !category.trim()) {
      return res.status(400).json({ success: false, error: 'Post category cannot be empty.' });
    }
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ success: false, error: 'Post content cannot be empty.' });
    }

    const updatedPost = updatePost(id, {
      title,
      author,
      category,
      excerpt,
      content,
      imageUrl,
      status
    });

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost
    });
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({ success: false, error: 'Failed to update blog post.' });
  }
});

/**
 * DELETE /api/blog/:id
 * Deletes a blog post by ID (Protected by JWT)
 */
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const removed = removePost(id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: `Blog post with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.status(500).json({ success: false, error: 'Failed to delete blog post.' });
  }
});

export default router;
