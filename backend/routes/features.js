const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const db = require('../config/db');
const validate = require('../middleware/validate');

// GET all features (with optional status filter)
router.get('/', [
  query('status').optional().isIn(['Open', 'In Progress', 'Completed']).withMessage('Invalid status filter'),
], validate, async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM features';
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.execute(sql, params);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// GET single feature
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
], validate, async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM features WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Feature not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// POST create feature
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').isIn(['Open', 'In Progress', 'Completed']).withMessage('Invalid status'),
], validate, async (req, res, next) => {
  try {
    const { title, description, priority, status } = req.body;
    const [result] = await db.execute(
      'INSERT INTO features (title, description, priority, status) VALUES (?, ?, ?, ?)',
      [title, description, priority, status || 'Open']
    );
    const [rows] = await db.execute('SELECT * FROM features WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0], message: 'Feature created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT update feature
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').isIn(['Open', 'In Progress', 'Completed']).withMessage('Invalid status'),
], validate, async (req, res, next) => {
  try {
    const { title, description, priority, status } = req.body;
    const [result] = await db.execute(
      'UPDATE features SET title=?, description=?, priority=?, status=? WHERE id=?',
      [title, description, priority, status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Feature not found' });
    const [rows] = await db.execute('SELECT * FROM features WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0], message: 'Feature updated successfully' });
  } catch (err) {
    next(err);
  }
});

// PATCH update status only
router.patch('/:id/status', [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
  body('status').isIn(['Open', 'In Progress', 'Completed']).withMessage('Invalid status'),
], validate, async (req, res, next) => {
  try {
    const [result] = await db.execute(
      'UPDATE features SET status=? WHERE id=?',
      [req.body.status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Feature not found' });
    const [rows] = await db.execute('SELECT * FROM features WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0], message: 'Status updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE feature
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
], validate, async (req, res, next) => {
  try {
    const [result] = await db.execute('DELETE FROM features WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Feature not found' });
    res.json({ success: true, message: 'Feature deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
