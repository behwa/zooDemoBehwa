import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { tasksRouter } from './routes/tasks';
import authRoutes from './routes/authRoutes';

const app = express();

// Enable CORS to allow frontend (http://localhost:3000) to call backend APIs
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());

app.use('/api/tasks', tasksRouter);
app.use('/api', authRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
