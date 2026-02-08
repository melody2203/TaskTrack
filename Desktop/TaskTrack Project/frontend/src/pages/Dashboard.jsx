import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import ManagerView from '../components/ManagerView';
import MemberView from '../components/MemberView';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
                <div>
                    <h1 className="text-xl font-bold">TaskTrack Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user.name} ({user.role})</p>
                </div>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                    Logout
                </button>
            </header>

            {user.role === 'MANAGER' ? (
                <ManagerView tasks={tasks} refreshTasks={fetchTasks} />
            ) : (
                <MemberView tasks={tasks} refreshTasks={fetchTasks} />
            )}
        </div>
    );
};

export default Dashboard;
