// backend/routes/authRoutes.ts
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { userid, password, role } = req.body;

  if (!userid || !password || !role) {
    return res.status(400).json({ message: 'userid, password, and role are required' });
  }

  try {
    // 1. Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user
    const result = await pool.query(
      'INSERT INTO users (userid, password, role) VALUES ($1, $2, $3) RETURNING id, userid, role',
      [userid, hashedPassword, role]
    );

    const newUser = result.rows[0];

    // 4. Generate JWT with role included
    const token = jwt.sign(
      { userId: newUser.id, userid: newUser.userid, role: newUser.role },
      process.env.JWT_KEY || 'secretJTW_TEST_DEMO',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      userid: newUser.userid,
      role: newUser.role,
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: 'userid and password are required' });
  }

  try {
    // 1. Find user by userid
    const result = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid userid or password' });
    }

    const user = result.rows[0];

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid userid or password' });
    }

    // 3. Generate JWT with role included
    const token = jwt.sign(
      { userId: user.id, userid: user.userid, role: user.role },
      process.env.JWT_KEY || 'secretJTW_TEST_DEMO',
      { expiresIn: '1h' }
    );

    // 4. Return user info + token
    res.status(200).json({
      userid: user.userid,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  const users = await pool.query('SELECT id, userid AS name FROM users'); // or adjust column
  res.json({ users: users.rows });
});

export default router;
