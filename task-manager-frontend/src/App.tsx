import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTask from './CreateTask';
import EditTask from './EditTask';
import TaskList from './components/TaskList/TaskList';
import { sortTasks } from './components/TaskList/taskUtils';

import Navbar from './components/Navbar';  // adjust path if needed
import Signup from './Signup';
import Login from './Login';
import ViewTask from './ViewTask';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdtime: string; 
  createdby: string;
  assignee: string;
  // due date
  // occurence true - daily weekly monthly / weekday / weekend
  // priority - low / medium / high
  // Finish completed time date
  // turn around time.
  // location - sub - branches 
  // department
  // Work Category/ Services - Cleanining / Food / Tour 
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:4000/api/tasks');
    const data = await res.json();

    const tasksWithCreatedBy = data.map((task: any) => ({
      ...task,
      createdby: task.createdby || 'Unknown',
    }));

    // Sort by createdtime descending (newest first)
    const sortedTasks = sortTasks(tasksWithCreatedBy, 'createdtime', 'desc');
    setTasks(sortedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const handleBulkDelete = async (ids: string[]) => {
    await Promise.all(ids.map(id =>
      fetch(`http://localhost:4000/api/tasks/${id}`, { method: 'DELETE' })
    ));
    fetchTasks();
  };


  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <>
              <TaskList tasks={tasks} onDelete={handleDelete} onBulkDelete={handleBulkDelete} />
              <hr />
              <CreateTask onCreated={fetchTasks} />
            </>
          } />
          <Route path="/tasks/edit/:id" element={<EditTask onUpdated={fetchTasks} />} />
          <Route path="/tasks/view/:id" element={<ViewTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
