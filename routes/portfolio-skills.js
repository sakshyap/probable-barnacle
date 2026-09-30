import express from 'express';
import {
  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  removeSkillCategory,
  reorderSkillCategories
} from '../data/portfolio-db.js';
import { verifyPortfolioToken } from '../middleware/portfolio-auth.js';

const router = express.Router();

const ACCENT_COLORS = ['purple', 'teal', 'pink', 'blue', 'emerald', 'amber', 'rose'];

function validate(payload, { partial = false } = {}) {
  if (!partial && (!payload.title || !String(payload.title).trim())) {
    return 'Category title is required.';
  }

  if (payload.title !== undefined && !String(payload.title).trim()) {
    return 'Category title cannot be empty.';
  }

  if (payload.accentColor !== undefined && !ACCENT_COLORS.includes(String(payload.accentColor))) {
    return `Accent colour must be one of: ${ACCENT_COLORS.join(', ')}.`;
  }

  if (payload.items !== undefined) {
    if (!Array.isArray(payload.items)) {
      return 'Skills must be sent as a list.';
    }
    for (const item of payload.items) {
      if (!item || !String(item.name || '').trim()) {
        return 'Every skill needs a name.';
      }
    }
  }

  return null;
}

/**
 * GET /api/portfolio/skills
 */
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: getSkillCategories().length, data: getSkillCategories() });
});

/**
 * POST /api/portfolio/skills
 */
router.post('/', verifyPortfolioToken, (req, res) => {
  const error = validate(req.body || {});
  if (error) return res.status(400).json({ success: false, error });

  res.status(201).json({
    success: true,
    message: 'Skill category created',
    data: createSkillCategory(req.body)
  });
});

/**
 * PUT /api/portfolio/skills/reorder
 * Body: { ids: ["web-dev", "game-dev"] }
 */
router.put('/reorder', verifyPortfolioToken, (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ success: false, error: 'Body must contain an "ids" array.' });
  }
  res.status(200).json({ success: true, message: 'Skill order saved', data: reorderSkillCategories(ids) });
});

/**
 * PUT /api/portfolio/skills/:id
 */
router.put('/:id', verifyPortfolioToken, (req, res) => {
  const error = validate(req.body || {}, { partial: true });
  if (error) return res.status(400).json({ success: false, error });

  const updated = updateSkillCategory(req.params.id, req.body || {});
  if (!updated) {
    return res.status(404).json({ success: false, error: `No skill category with id "${req.params.id}".` });
  }

  res.status(200).json({ success: true, message: 'Skill category updated', data: updated });
});

/**
 * DELETE /api/portfolio/skills/:id
 */
router.delete('/:id', verifyPortfolioToken, (req, res) => {
  const removed = removeSkillCategory(req.params.id);
  if (!removed) {
    return res.status(404).json({ success: false, error: `No skill category with id "${req.params.id}".` });
  }
  res.status(200).json({ success: true, message: 'Skill category deleted' });
});

export default router;
