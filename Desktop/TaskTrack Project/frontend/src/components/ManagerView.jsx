import React, { useState } from 'react';
import api from '../api/api';

const ManagerView = ({ tasks, refreshTasks }) => {
    const [formData, setFormData] = useState({ title: '', description: '', assigned_to_id: '', deadline: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            setFormData({ title: '', description: '', assigned_to_id: '', deadline: '' });
            refreshTasks();
        } catch (err) {
            alert('Task creation failed');
        }
    };

    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'DONE').length;
        return Math.round((completed / tasks.length) * 100);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full p-2 border rounded"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Assigned To (User ID)"
                        className="w-full p-2 border rounded"
                        value={formData.assigned_to_id}
                        onChange={e => setFormData({ ...formData, assigned_to_id: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        required
                    />
                    <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                        Assign Task
                    </button>
                </form>
            </section>

            <section>
                <div className="mb-4 bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-bold mb-2">Progress Summary</h2>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{calculateProgress()}% tasks completed</p>
                </div>

                <div className="bg-white p-6 rounded shadow h-[400px] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Task List</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Title</th>
                                <th className="py-2">Assignee</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="border-b">
                                    <td className="py-2">{task.title}</td>
                                    <td className="py-2">{task.assigned_to?.name || `ID: ${task.assigned_to_id}`}</td>
                                    <td className="py-2">
                                        <span className={`px-2 py-1 rounded text-xs ${task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                                                task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default ManagerView;
