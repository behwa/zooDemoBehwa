// src/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres', // change user name 
  host: 'localhost',
  // database: 'task_manager',
  database: 'taskManger2', // change database name 
  password: '1234', // change password
  port: 5432,
});
