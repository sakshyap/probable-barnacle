import express from 'express';
import {
  getMessages,
  createMessage,
  markMessageRead,
  removeMessage
} from '../data/portfolio-db.js';
import { verifyPortfolioToken } from '../middleware/portfolio-auth.js';

const router = express.Router();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_IP = 5;

const submissionsByIp = new Map();

function isRateLimited(ip) {
  const entry = submissionsByIp.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    submissionsByIp.delete(ip);
    return false;
  }
  return entry.count >= MAX_SUBMISSIONS_PER_IP;
}

function recordSubmission(ip) {
  const entry = submissionsByIp.get(ip);
  if (entry) {
    entry.count += 1;
  } else {
    submissionsByIp.set(ip, { count: 1, firstAt: Date.now() });
  }
}

setInterval(() => {
  for (const [ip, entry] of submissionsByIp) {
    if (Date.now() - entry.firstAt > WINDOW_MS) submissionsByIp.delete(ip);
  }
}, WINDOW_MS).unref();

/**
 * POST /api/portfolio/messages
 * Public endpoint backing the contact form. Rate limited and honeypot guarded
 * so the inbox cannot be flooded by bots.
 */
router.post('/', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      success: false,
      error: 'Too many messages sent from this network. Please try again later.'
    });
  }

  const body = req.body || {};

  // Honeypot: real visitors never see or fill this field.
  if (body.website) {
    return res.status(202).json({ success: true, message: 'Thanks, your message was received.' });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const subject = String(body.subject || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email and message are all required.'
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Enter a valid email address.' });
  }

  if (message.length > 5000) {
    return res.status(400).json({ success: false, error: 'Message is too long (5000 characters max).' });
  }

  recordSubmission(ip);

  res.status(201).json({
    success: true,
    message: 'Your message was sent. Sakshi will get back to you soon.',
    data: createMessage({ name, email, subject, message })
  });
});

/**
 * GET /api/portfolio/messages (admin)
 */
router.get('/', verifyPortfolioToken, (req, res) => {
  const messages = getMessages();
  res.status(200).json({
    success: true,
    count: messages.length,
    unread: messages.filter((item) => !item.read).length,
    data: messages
  });
});

/**
 * PUT /api/portfolio/messages/:id/read
 */
router.put('/:id/read', verifyPortfolioToken, (req, res) => {
  const read = req.body?.read !== false;
  const updated = markMessageRead(req.params.id, read);
  if (!updated) {
    return res.status(404).json({ success: false, error: `No message with id "${req.params.id}".` });
  }
  res.status(200).json({ success: true, data: updated });
});

/**
 * DELETE /api/portfolio/messages/:id
 */
router.delete('/:id', verifyPortfolioToken, (req, res) => {
  const removed = removeMessage(req.params.id);
  if (!removed) {
    return res.status(404).json({ success: false, error: `No message with id "${req.params.id}".` });
  }
  res.status(200).json({ success: true, message: 'Message deleted' });
});

export default router;
