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

const router = express.Router();

/**
 * Social profile links and navbar entries, grouped because they are both
 * "site chrome" that the navbar, footer and contact section all read.
 */

// ---------------- Socials ----------------

router.get('/socials', (req, res) => {
  res.status(200).json({ success: true, data: getSocials() });
});

router.post('/socials', verifyPortfolioToken, (req, res) => {
  const { platform, url } = req.body || {};
  if (!platform || !String(platform).trim()) {
    return res.status(400).json({ success: false, error: 'Platform name is required.' });
  }
  if (!url || !String(url).trim()) {
    return res.status(400).json({ success: false, error: 'Profile URL is required.' });
  }
  if (getSocials().some((item) => item.platform.toLowerCase() === String(platform).trim().toLowerCase())) {
    return res.status(409).json({ success: false, error: 'That platform already exists.' });
  }

  res.status(201).json({ success: true, message: 'Social link added', data: createSocial(req.body) });
});

router.put('/socials/:platform', verifyPortfolioToken, (req, res) => {
  const { platform } = req.params;
  const body = req.body || {};

  if (body.url !== undefined && !String(body.url).trim()) {
    return res.status(400).json({ success: false, error: 'Profile URL cannot be empty.' });
  }

  const updated = updateSocial(platform, body);
  if (!updated) {
    return res.status(404).json({ success: false, error: `No social link named "${platform}".` });
  }

  res.status(200).json({ success: true, message: 'Social link updated', data: updated });
});

router.delete('/socials/:platform', verifyPortfolioToken, (req, res) => {
  const removed = removeSocial(req.params.platform);
  if (!removed) {
    return res.status(404).json({ success: false, error: `No social link named "${req.params.platform}".` });
  }
  res.status(200).json({ success: true, message: 'Social link removed' });
});

// ---------------- Navbar items ----------------

router.get('/nav', (req, res) => {
  res.status(200).json({ success: true, data: getNavItems() });
});

router.post('/nav', verifyPortfolioToken, (req, res) => {
  const { label } = req.body || {};
  if (!label || !String(label).trim()) {
    return res.status(400).json({ success: false, error: 'Menu label is required.' });
  }
  if (getNavItems().some((item) => item.label.toLowerCase() === String(label).trim().toLowerCase())) {
    return res.status(409).json({ success: false, error: 'That menu item already exists.' });
  }

  res.status(201).json({ success: true, message: 'Menu item added', data: createNavItem(req.body) });
});

router.put('/nav/:id', verifyPortfolioToken, (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  if (body.label !== undefined && !String(body.label).trim()) {
    return res.status(400).json({ success: false, error: 'Menu label cannot be empty.' });
  }

  const updated = updateNavItem(id, body);
  if (!updated) {
    return res.status(404).json({ success: false, error: `No menu item with id "${id}".` });
  }

  res.status(200).json({ success: true, message: 'Menu item updated', data: updated });
});

router.delete('/nav/:id', verifyPortfolioToken, (req, res) => {
  const removed = removeNavItem(req.params.id);
  if (!removed) {
    return res.status(404).json({ success: false, error: `No menu item with id "${req.params.id}".` });
  }
  res.status(200).json({ success: true, message: 'Menu item removed' });
});

export default router;
