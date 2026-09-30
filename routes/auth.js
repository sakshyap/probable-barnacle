import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAdminUser } from '../data/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Validates admin credentials and returns an 8-hour JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const admin = getAdminUser();
    if (!admin) {
      return res.status(500).json({
        success: false,
        error: 'Admin configuration not found in database.'
      });
    }

    // Verify email (case-insensitive)
    if (admin.email.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Verify password with bcryptjs
    let isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch && typeof password === 'string' && password.trim() !== password) {
      isMatch = await bcrypt.compare(password.trim(), admin.passwordHash);
    }
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Generate JWT token (8 hours expiration)
    const secret = process.env.JWT_SECRET || 'supersecret_admin_jwt_key_2026_change_in_production';
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role || 'admin'
      },
      secret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role || 'admin'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing login.'
    });
  }
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated admin's profile
 */
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

/**
 * POST /api/auth/logout
 * Sign out confirmation endpoint
 */
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
