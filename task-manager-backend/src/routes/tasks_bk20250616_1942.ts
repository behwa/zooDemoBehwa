import express, { Request, Response } from 'express';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}


const tasks: Task[] = [];

const router = express.Router();

// GET /api/tasks - get all tasks
router.get('/', (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks - create a new task
router.post('/', (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const newTask: Task = {
    id: (tasks.length + 1).toString(),
        title,
        description,
        completed: false,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// ==================
// PUT /api/tasks/:id - update a task's title or completed status
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (title !== undefined) {
    task.title = title;
  }
  if (description !== undefined) {
    task.description = description;
  }
  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json(task);
});

// ==================Part 2===========================
// PATCH /api/tasks/:id/complete - mark task as completed
router.patch('/:id/complete', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.completed = true;
  res.json(task);
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send(); // No content
});

// ===============================================
// Edit Page
// GET /api/tasks/:id - get a single task by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});



export { router as tasksRouter };


