import express from 'express';
import { getAllStudents, createStudent, removeStudent } from '../data/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All students routes are protected by JWT verification middleware
router.use(verifyToken);

/**
 * GET /api/students
 * Returns the list of all students
 */
router.get('/', (req, res) => {
  try {
    const students = getAllStudents();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve students list.' });
  }
});

/**
 * POST /api/students
 * Creates a new student record
 * Body: { name, email, enrolledCourse }
 */
router.post('/', (req, res) => {
  try {
    const { name, email, enrolledCourse } = req.body;

    // Validate fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Student name is required.' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid student email address is required.' });
    }
    if (!enrolledCourse || !enrolledCourse.trim()) {
      return res.status(400).json({ success: false, error: 'Enrolled course title is required.' });
    }

    // Check if email already registered
    const existingStudents = getAllStudents();
    const isDuplicate = existingStudents.some(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        error: `A student with email "${email.trim()}" is already enrolled.`
      });
    }

    const newStudent = createStudent({ name, email, enrolledCourse });

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: newStudent
    });
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ success: false, error: 'Failed to create student record.' });
  }
});

/**
 * DELETE /api/students/:id
 * Removes a student by ID
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const removed = removeStudent(id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: `Student with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student removed successfully'
    });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ success: false, error: 'Failed to delete student record.' });
  }
});

export default router;
