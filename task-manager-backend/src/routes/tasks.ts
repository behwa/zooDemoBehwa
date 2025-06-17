import express, { Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// GET all tasks
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET task by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(`GET /tasks/${id} error:`, err);
    res.status(500).json({ message: 'Failed to retrieve task' });
  }
});

// CREATE a new task
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, description, status, assignee = 'Unknown' } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const createdBy = req.user?.userid; // From JWT

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { rows } = await pool.query(
      'INSERT INTO tasks (title, description, status, createdBy, assignee) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, status, createdBy, assignee]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// UPDATE a task
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, assignee } = req.body;

  if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { rows } = await pool.query(
      `UPDATE tasks 
      SET title = $1, description = $2, status = $3, assignee = $4
      WHERE id = $5 
      RETURNING *`,
      [title, description, status, assignee || 'Unknown', id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(`PUT /tasks/${id} error:`, err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (rowCount === 0) return res.status(404).json({ message: 'Task not found' });

    res.status(204).send();
  } catch (err) {
    console.error(`DELETE /tasks/${id} error:`, err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

export { router as tasksRouter };
