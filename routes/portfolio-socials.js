import express from 'express';
import {
  getSocials,
  createSocial,
  updateSocial,
  removeSocial,
  getNavItems,
  createNavItem,
  updateNavItem,
  removeNavItem
} from '../data/portfolio-db.js';
import { verifyPortfolioToken } from '../middleware/portfolio-auth.js';
import { sendError } from '../middleware/error-response.js';

const router = express.Router();

/**
 * Social profile links and navbar entries, grouped because they are both
 * "site chrome" that the navbar, footer and contact section all read.
 *
 * Mounted at /api/portfolio/socials, so:
 *   /                       -> /api/portfolio/socials
 *   /:platform              -> /api/portfolio/socials/:platform
 *   /nav                    -> /api/portfolio/socials/nav
 *   /nav/:id                -> /api/portfolio/socials/nav/:id
 *
 * "/nav/..." is always two segments long, so the single-segment "/:platform"
 * routes below can never swallow a navbar request.
 */

// ---------------- Socials ----------------

router.get('/', async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await getSocials() });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve social links.');
  }
});

router.post('/', verifyPortfolioToken, async (req, res) => {
  const { platform, url } = req.body || {};
  if (!platform || !String(platform).trim()) {
    return res.status(400).json({ success: false, error: 'Platform name is required.' });
  }
  if (!url || !String(url).trim()) {
    return res.status(400).json({ success: false, error: 'Profile URL is required.' });
  }

  try {
    const socials = await getSocials();
    if (socials.some((item) => item.platform.toLowerCase() === String(platform).trim().toLowerCase())) {
      return res.status(409).json({ success: false, error: 'That platform already exists.' });
    }

    res.status(201).json({ success: true, message: 'Social link added', data: await createSocial(req.body) });
  } catch (err) {
    sendError(res, err, 'Failed to add the social link.');
  }
});

router.put('/:platform', verifyPortfolioToken, async (req, res) => {
  const { platform } = req.params;
  const body = req.body || {};

  if (body.url !== undefined && !String(body.url).trim()) {
    return res.status(400).json({ success: false, error: 'Profile URL cannot be empty.' });
  }

  try {
    const updated = await updateSocial(platform, body);
    if (!updated) {
      return res.status(404).json({ success: false, error: `No social link named "${platform}".` });
    }

    res.status(200).json({ success: true, message: 'Social link updated', data: updated });
  } catch (err) {
    sendError(res, err, 'Failed to update the social link.');
  }
});

router.delete('/:platform', verifyPortfolioToken, async (req, res) => {
  try {
    const removed = await removeSocial(req.params.platform);
    if (!removed) {
      return res.status(404).json({ success: false, error: `No social link named "${req.params.platform}".` });
    }
    res.status(200).json({ success: true, message: 'Social link removed' });
  } catch (err) {
    sendError(res, err, 'Failed to remove the social link.');
  }
});

// ---------------- Navbar items ----------------

router.get('/nav', async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await getNavItems() });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve menu items.');
  }
});

router.post('/nav', verifyPortfolioToken, async (req, res) => {
  const { label } = req.body || {};
  if (!label || !String(label).trim()) {
    return res.status(400).json({ success: false, error: 'Menu label is required.' });
  }

  try {
    const items = await getNavItems();
    if (items.some((item) => item.label.toLowerCase() === String(label).trim().toLowerCase())) {
      return res.status(409).json({ success: false, error: 'That menu item already exists.' });
    }

    res.status(201).json({ success: true, message: 'Menu item added', data: await createNavItem(req.body) });
  } catch (err) {
    sendError(res, err, 'Failed to add the menu item.');
  }
});

router.put('/nav/:id', verifyPortfolioToken, async (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  if (body.label !== undefined && !String(body.label).trim()) {
    return res.status(400).json({ success: false, error: 'Menu label cannot be empty.' });
  }

  try {
    const updated = await updateNavItem(id, body);
    if (!updated) {
      return res.status(404).json({ success: false, error: `No menu item with id "${id}".` });
    }

    res.status(200).json({ success: true, message: 'Menu item updated', data: updated });
  } catch (err) {
    sendError(res, err, 'Failed to update the menu item.');
  }
});

router.delete('/nav/:id', verifyPortfolioToken, async (req, res) => {
  try {
    const removed = await removeNavItem(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, error: `No menu item with id "${req.params.id}".` });
    }
    res.status(200).json({ success: true, message: 'Menu item removed' });
  } catch (err) {
    sendError(res, err, 'Failed to remove the menu item.');
  }
});

export default router;