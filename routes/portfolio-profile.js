import express from 'express';
import { getProfile, updateProfile } from '../data/portfolio-db.js';
import { verifyPortfolioToken } from '../middleware/portfolio-auth.js';

const router = express.Router();

const TEXT_FIELDS = [
  'name',
  'title',
  'shortIntro',
  'location',
  'email',
  'status',
  'bioParagraph1',
  'bioParagraph2'
];

/**
 * GET /api/portfolio/profile
 * Publicly readable - the hero and about sections depend on it.
 */
router.get('/', (req, res) => {
  try {
    res.status(200).json({ success: true, data: getProfile() });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve the profile.' });
  }
});

/**
 * PUT /api/portfolio/profile
 * Accepts a partial patch; only the supplied keys are written.
 */
router.put('/', verifyPortfolioToken, (req, res) => {
  try {
    const body = req.body || {};
    const patch = {};

    for (const field of TEXT_FIELDS) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== 'string') {
          return res.status(400).json({
            success: false,
            error: `Field "${field}" must be a string.`
          });
        }
        patch[field] = body[field].trim();
      }
    }

    if (body.email !== undefined && patch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.email)) {
      return res.status(400).json({ success: false, error: 'Enter a valid email address.' });
    }

    if (patch.name === '') {
      return res.status(400).json({ success: false, error: 'Name cannot be empty.' });
    }

    if (body.highlights !== undefined) {
      if (!Array.isArray(body.highlights)) {
        return res.status(400).json({ success: false, error: 'Highlights must be a list.' });
      }
      patch.highlights = body.highlights
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          label: String(item.label || '').trim(),
          value: String(item.value || '').trim(),
          detail: String(item.detail || '').trim()
        }));
    }

    if (body.stats !== undefined) {
      if (!Array.isArray(body.stats)) {
        return res.status(400).json({ success: false, error: 'Stats must be a list.' });
      }
      patch.stats = body.stats
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          number: String(item.number || '').trim(),
          label: String(item.label || '').trim()
        }));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updateProfile(patch)
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, error: 'Failed to update the profile.' });
  }
});

export default router;
