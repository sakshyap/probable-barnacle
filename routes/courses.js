import express from 'express';
import { getAllCourses, createCourse, removeCourse } from '../data/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/courses
 * Returns all courses (Publicly readable)
 */
router.get('/', (req, res) => {
  try {
    const courses = getAllCourses();
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve courses list.' });
  }
});

/**
 * POST /api/courses
 * Creates a new course (Protected by JWT)
 * Body: { title, seats, active }
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, seats, active } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Course title is required.' });
    }

    const seatsNumber = parseInt(seats, 10);
    if (isNaN(seatsNumber) || seatsNumber < 1) {
      return res.status(400).json({ success: false, error: 'Seats must be a positive integer greater than 0.' });
    }

    const newCourse = createCourse({
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
    console.error('Error adding course:', err);
    res.status(500).json({ success: false, error: 'Failed to create course.' });
  }
});

/**
 * DELETE /api/courses/:id
 * Removes a course by ID (Protected by JWT)
 */
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const removed = removeCourse(id);

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
    console.error('Error deleting course:', err);
    res.status(500).json({ success: false, error: 'Failed to delete course.' });
  }
});

export default router;
