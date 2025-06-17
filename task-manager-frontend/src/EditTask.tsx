import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignee: string;
}

interface EditTaskProps {
    onUpdated: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ onUpdated }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('Unknown');
    const [users, setUsers] = useState<string[]>([]);
    const [status, setStatus] = useState<Task['status']>('Pending');
    const [error, setError] = useState('');

    const isValidStatus = (val: any): val is Task['status'] =>
        ['Pending', 'In Progress', 'Completed'].includes(val);

    useEffect(() => {
        const fetchTaskAndUsers = async () => {
            try {
                // Fetch task
                const taskRes = await fetch(`http://localhost:4000/api/tasks/${id}`);
                if (!taskRes.ok) throw new Error('Task not found');
                const taskData = await taskRes.json();

                setTask(taskData);
                setTitle(taskData.title);
                setDescription(taskData.description);
                setAssignee(taskData.assignee || 'Unknown');
                setStatus(isValidStatus(taskData.status) ? taskData.status : 'Pending');

                // Fetch users
                const usersRes = await fetch('http://localhost:4000/api/users');
                // const usersRes = await fetch(`http://localhost:4000/api/users`);
                if (!usersRes.ok) throw new Error('Failed to fetch users');
                const usersData = await usersRes.json();

                console.log('usersData = ' + JSON.stringify(usersData))

                // assuming usersData is an array of usernames like ["Alice", "Bob"]
                setUsers(usersData.users.map((u: any) => u.name));
            } catch (err) {
                setError('Failed to load task or users');
            }
        };

        fetchTaskAndUsers();
    }, [id]);


    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, status, assignee }),
            });

            if (!res.ok) throw new Error('Update failed');
            onUpdated();
            navigate('/');
        } catch {
            setError('Failed to update task');
        }
    };

    if (error) return <p>{error}</p>;
    if (!task) return <p>Loading...</p>;

    return (
        <div
            className="p-5 mx-auto my-5"
            style={{
                maxWidth: '600px',
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(37, 117, 252, 0.4)',
                color: 'white',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <h2 className="text-center mb-4" style={{ fontWeight: '700', letterSpacing: '1.2px' }}>
                Edit Task
            </h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="editTitle" className="form-label" style={{ fontWeight: '600' }}>
                        Task Title
                    </label>
                    <input
                        id="editTitle"
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                        required
                        autoFocus
                        style={{
                            borderRadius: '12px',
                            border: 'none',
                            padding: '12px',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                            fontSize: '1rem',
                            color: '#222',
                        }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px #fff')}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 8px rgba(0,0,0,0.2)')}
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="editDescription" className="form-label" style={{ fontWeight: '600' }}>
                        Task Description
                    </label>
                    <textarea
                        id="editDescription"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task Description"
                        rows={4}
                        required
                        style={{
                            borderRadius: '12px',
                            border: 'none',
                            padding: '12px',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                            fontSize: '1rem',
                            color: '#222',
                            resize: 'vertical',
                        }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 8px #fff')}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 8px rgba(0,0,0,0.2)')}
                    />
                </div>

                {/* Assignee */}
                <div className="mb-4">
                    <label htmlFor="editAssignee" className="form-label" style={{ fontWeight: '600' }}>
                        Assignee
                    </label>
                    <select
                        id="editAssignee"
                        className="form-select"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        required
                        style={{
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '1rem',
                            color: '#222',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                        }}
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label htmlFor="editStatus" className="form-label" style={{ fontWeight: '600' }}>
                        Status
                    </label>
                    <select
                        id="editStatus"
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Task['status'])}
                        required
                        style={{
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '1rem',
                            color: '#222',
                            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
                        }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                    <button
                        type="submit"
                        className="btn"
                        style={{
                            background: 'white',
                            color: '#2575fc',
                            fontWeight: '700',
                            borderRadius: '30px',
                            padding: '10px 30px',
                            boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2575fc';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 117, 252, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#2575fc';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 255, 255, 0.3)';
                        }}
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{
                            borderRadius: '30px',
                            padding: '10px 30px',
                            fontWeight: '600',
                            boxShadow: '0 4px 10px rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            color: 'white',
                            borderColor: 'white',
                        }}
                        onClick={() => navigate('/')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;
