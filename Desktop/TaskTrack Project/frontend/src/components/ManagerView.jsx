import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ManagerView = ({ tasks, refreshTasks }) => {
    const [formData, setFormData] = useState({ title: '', description: '', assigned_to_id: '', deadline: '' });
    const [members, setMembers] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchMembers = async () => {
        try {
            setFetchError(null);
            const { data } = await api.get('/users');
            setMembers(data);
        } catch (err) {
            console.error('Failed to fetch members:', err);
            setFetchError('Could not load member list. You can still use the manual ID entry.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', formData);
            setFormData({ title: '', description: '', assigned_to_id: '', deadline: '' });
            refreshTasks();
            showNotification('Task assigned successfully!', 'success');
        } catch (err) {
            console.error('Task creation error:', err.response?.data || err.message);
            showNotification(err.response?.data?.error || 'Task creation failed', 'error');
        }
    };

    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'DONE').length;
        return Math.round((completed / tasks.length) * 100);
    };

    return (
        <div className="relative">
            {/* Success/Error Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-2 transition-all duration-500 transform translate-y-0 animate-in fade-in slide-in-from-top-4 ${notification.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                        {notification.type === 'success' ? '✓' : '!'}
                    </div>
                    <p className="font-bold tracking-tight">{notification.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Assign New Task</h2>
                        <button
                            onClick={fetchMembers}
                            className="text-[10px] bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 text-gray-500"
                        >
                            🔄 Refresh Members
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Design Landing Page"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Details about the task..."
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm h-32"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Dropdown)</label>
                                <select
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                    value={formData.assigned_to_id}
                                    onChange={e => setFormData({ ...formData, assigned_to_id: e.target.value })}
                                >
                                    <option value="">Select a member</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>
                                            [ID: {member.id}] {member.name} ({member.email})
                                        </option>
                                    ))}
                                </select>
                                {fetchError && <p className="text-[10px] text-red-500">{fetchError}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Manual ID Assignment</label>
                                <input
                                    type="number"
                                    placeholder="Enter Member ID manually"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                    value={formData.assigned_to_id}
                                    onChange={e => setFormData({ ...formData, assigned_to_id: e.target.value })}
                                    required
                                />
                                <p className="text-[9px] text-gray-400 mt-1">Both fields update the same value.</p>
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                required
                            />
                        </div>

                        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg mt-4">
                            🚀 Assign Task
                        </button>
                    </form>
                </section>

                <section className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Team Progress</h2>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                            <div
                                className="bg-blue-600 h-4 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${calculateProgress()}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <p className="text-sm font-semibold text-gray-600">{calculateProgress()}% Completed</p>
                            <p className="text-sm text-gray-500">{tasks.length} total tasks</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-[500px] overflow-hidden flex flex-col">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Task Overview</h2>
                        <div className="overflow-y-auto flex-grow">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="border-b-2 border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="py-3 font-semibold">Title</th>
                                        <th className="py-3 font-semibold">Member (ID)</th>
                                        <th className="py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tasks.map(task => (
                                        <tr key={task.id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 font-medium text-gray-800">{task.title}</td>
                                            <td className="py-4 text-gray-600 flex items-center gap-2 text-sm">
                                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                    {task.assigned_to?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{task.assigned_to?.name || 'Unassigned'}</p>
                                                    <p className="text-[10px] text-gray-400">ID: {task.assigned_to_id}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm ${task.status === 'DONE' ? 'bg-green-100 text-green-700' :
                                                    task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {tasks.length === 0 && <div className="text-center py-10 text-gray-400">No tasks created yet.</div>}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ManagerView;


