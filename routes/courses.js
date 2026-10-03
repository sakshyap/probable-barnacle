import express from 'express';
import { getAllCourses, createCourse, removeCourse } from '../data/db.js';
import { verifyToken } from '../middleware/auth.js';
import { sendError } from '../middleware/error-response.js';

const router = express.Router();

/**
 * GET /api/courses
 * Returns all courses (Publicly readable)
 */
router.get('/', async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    sendError(res, err, 'Failed to retrieve courses list.');
  }
});

/**
 * POST /api/courses
 * Creates a new course (Protected by JWT)
 * Body: { title, seats, active }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, seats, active } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Course title is required.' });
    }

    const seatsNumber = parseInt(seats, 10);
    if (isNaN(seatsNumber) || seatsNumber < 1) {
      return res.status(400).json({ success: false, error: 'Seats must be a positive integer greater than 0.' });
    }

    const newCourse = await createCourse({
      title,
      seats: seatsNumber,
      active: active === true || active === 'true' || active === 'on'
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    });
  } catch (err) {
    sendError(res, err, 'Failed to create course.');
  }
});

/**
 * DELETE /api/courses/:id
 * Removes a course by ID (Protected by JWT)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await removeCourse(id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: `Course with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course removed successfully'
    });
  } catch (err) {
    sendError(res, err, 'Failed to delete course.');
  }
});

export default router;
