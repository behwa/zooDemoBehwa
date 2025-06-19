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
    try {
      const res = await fetch('http://localhost:4000/api/tasks');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        return;
      }

      const tasksWithCreatedBy = data.map((task: any) => ({
        ...task,
        createdby: task.createdby || 'Unknown',
      }));

      // Sort by createdtime descending (newest first)
      const sortedTasks = sortTasks(tasksWithCreatedBy, 'createdtime', 'desc');
      setTasks(sortedTasks);
      
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete task ${id}`);
      }
    } catch (err) {
      console.error(err);
      fetchTasks();
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));

    try {
      await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
            method: 'DELETE',
          });

          if (!res.ok) {
            throw new Error(`Failed to delete task ${id}`);
          }
        })
      );
    } catch (err) {
      console.error(err);
      fetchTasks(); // reload from backend if anything fails
    }
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
