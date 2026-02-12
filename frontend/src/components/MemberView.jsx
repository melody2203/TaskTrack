import React from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const MemberView = ({ tasks, refreshTasks }) => {
    const { user: currentUser } = useAuth();

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/tasks/${id}`, { status });
            refreshTasks();
        } catch (err) {
            console.error('Status update failed', err);
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

    const myTasks = tasks.filter(t => t.assigned_to_id === currentUser.id);
    const otherTasks = tasks.filter(t => t.assigned_to_id !== currentUser.id);

    const TaskCard = ({ task, isOwn }) => (
        <div
            className={`p-5 bg-white border rounded-xl shadow-sm relative transition duration-300 hover:shadow-md ${task.status === 'DONE' ? 'opacity-70 grayscale-[0.2]' :
                isOverdue(task.deadline) ? 'border-red-200 bg-red-50' :
                    isDeadlineNear(task.deadline) ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'
                }`}
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${task.status === 'DONE' ? 'bg-green-100 text-green-700' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {task.status.replace('_', ' ')}
                </span>
                {isOverdue(task.deadline) && task.status !== 'DONE' && (
                    <span className="text-[10px] text-red-600 font-black uppercase bg-red-100 px-2 py-0.5 rounded-full">Overdue</span>
                )}
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{task.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>

            <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold">
                    {task.assigned_to?.name?.charAt(0) || '?'}
                </div>
                <span className="text-xs font-medium text-gray-600">
                    {isOwn ? 'Assigned to Me' : `Assigned to ${task.assigned_to?.name || 'Unknown'}`}
                </span>
            </div>

            <p className={`text-[11px] font-semibold mb-5 ${isOverdue(task.deadline) && task.status !== 'DONE' ? 'text-red-500' : 'text-gray-400'}`}>
                📅 Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>

            {isOwn && (
                <div className="flex gap-2 border-t pt-4">
                    {['PENDING', 'IN_PROGRESS', 'DONE'].map(status => (
                        <button
                            key={status}
                            onClick={() => updateStatus(task.id, status)}
                            className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition duration-200 ${task.status === status
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 border border-gray-100'
                                }`}
                        >
                            {status === 'IN_PROGRESS' ? 'WORKING' : status}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        🎯
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">My Tasks</h2>
                </div>
                {myTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTasks.map(task => <TaskCard key={task.id} task={task} isOwn={true} />)}
                    </div>
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center">
                        <p className="text-gray-400 font-medium">No tasks assigned to you right now. Take a break and enjoy! ☕</p>
                    </div>
                )}
            </section>

            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        🌐
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight text-opacity-80">Team Overview</h2>
                </div>
                {otherTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-85">
                        {otherTasks.map(task => <TaskCard key={task.id} task={task} isOwn={false} />)}
                    </div>
                ) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-8 text-center">
                        <p className="text-gray-400 font-medium text-sm">No other tasks in the pipeline.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MemberView;
