import React from 'react';
import api from '../api/api';

const MemberView = ({ tasks, refreshTasks }) => {
    const updateStatus = async (id, status) => {
        try {
            await api.put(`/tasks/${id}`, { status });
            refreshTasks();
        } catch (err) {
            alert('Status update failed');
        }
    };

    const isDeadlineNear = (deadline) => {
        const d = new Date(deadline);
        const now = new Date();
        const diff = d - now;
        return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000); // 3 days
    };

    const isOverdue = (deadline) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div className="bg-white p-6 rounded shadow overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Assigned Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={`p-4 border rounded relative ${task.status === 'DONE' ? 'opacity-75' :
                                isOverdue(task.deadline) ? 'border-red-500 bg-red-50' :
                                    isDeadlineNear(task.deadline) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                            }`}
                    >
                        {isOverdue(task.deadline) && task.status !== 'DONE' && (
                            <span className="absolute top-2 right-2 text-xs text-red-600 font-bold uppercase">Overdue</span>
                        )}
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                        <p className="text-xs text-gray-500 mb-4">
                            Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                            {['PENDING', 'IN_PROGRESS', 'DONE'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => updateStatus(task.id, status)}
                                    className={`text-xs px-2 py-1 rounded transition ${task.status === status
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && <p className="text-gray-500 italic">No tasks assigned to you yet.</p>}
            </div>
        </div>
    );
};

export default MemberView;
