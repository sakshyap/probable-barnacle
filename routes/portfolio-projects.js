import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  removeProject,
  reorderProjects
} from '../data/portfolio-db.js';
import { verifyPortfolioToken } from '../middleware/portfolio-auth.js';

const router = express.Router();

const VALID_CATEGORIES = ['Website Development', 'Game Development', 'AI Video', 'Other'];
const VALID_PREVIEW_TYPES = ['school', 'game', 'video'];

function validate(payload, { partial = false } = {}) {
  if (!partial) {
    if (!payload.title || !String(payload.title).trim()) {
      return 'Project title is required.';
    }
    if (!payload.description || !String(payload.description).trim()) {
      return 'Project description is required.';
    }
  } else {
    for (const field of ['title', 'description', 'longDescription', 'tagline', 'badge']) {
      if (payload[field] !== undefined && !String(payload[field]).trim()) {
        return `Field "${field}" cannot be empty.`;
      }
    }
  }

  if (payload.category !== undefined && !VALID_CATEGORIES.includes(String(payload.category))) {
    return `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`;
  }

  if (payload.previewType !== undefined && !VALID_PREVIEW_TYPES.includes(String(payload.previewType))) {
    return `Preview type must be one of: ${VALID_PREVIEW_TYPES.join(', ')}.`;
  }

  if (payload.liveUrl !== undefined && String(payload.liveUrl).trim()) {
    if (!/^https?:\/\//i.test(String(payload.liveUrl).trim())) {
      return 'Live URL must start with http:// or https://';
    }
  }

  if (payload.githubUrl !== undefined && String(payload.githubUrl).trim()) {
    if (!/^https?:\/\//i.test(String(payload.githubUrl).trim())) {
      return 'GitHub URL must start with http:// or https://';
    }
  }

  return null;
}

function parseList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => line.replace(/^[-*\s]+/, '').trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * GET /api/portfolio/projects
 */
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: getProjects().length, data: getProjects() });
});

/**
 * GET /api/portfolio/projects/:id
 */
router.get('/:id', (req, res) => {
  const project = getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: `No project with id "${req.params.id}".` });
  }
  res.status(200).json({ success: true, data: project });
});

/**
 * POST /api/portfolio/projects
 */
router.post('/', verifyPortfolioToken, (req, res) => {
  const body = req.body || {};
  const error = validate(body);
  if (error) return res.status(400).json({ success: false, error });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: createProject({ ...body, techStack: parseList(body.techStack), features: parseList(body.features) })
  });
});

/**
 * PUT /api/portfolio/projects/reorder
 * Body: { ids: ["id-1", "id-2"] }
 *
 * Declared before "/:id" so that the literal "reorder" segment is never
 * captured as a project id.
 */
router.put('/reorder', verifyPortfolioToken, (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ success: false, error: 'Body must contain an "ids" array.' });
  }
  res.status(200).json({ success: true, message: 'Project order saved', data: reorderProjects(ids) });
});

/**
 * PUT /api/portfolio/projects/:id
 */
router.put('/:id', verifyPortfolioToken, (req, res) => {
  const body = req.body || {};
  const error = validate(body, { partial: true });
  if (error) return res.status(400).json({ success: false, error });

  if (!getProjectById(req.params.id)) {
    return res.status(404).json({ success: false, error: `No project with id "${req.params.id}".` });
  }

  const patch = { ...body };
  if (body.techStack !== undefined) patch.techStack = parseList(body.techStack);
  if (body.features !== undefined) patch.features = parseList(body.features);

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: updateProject(req.params.id, patch)
  });
});

/**
 * DELETE /api/portfolio/projects/:id
 */
router.delete('/:id', verifyPortfolioToken, (req, res) => {
  const removed = removeProject(req.params.id);
  if (!removed) {
    return res.status(404).json({ success: false, error: `No project with id "${req.params.id}".` });
  }
  res.status(200).json({ success: true, message: 'Project deleted' });
});

export default router;
