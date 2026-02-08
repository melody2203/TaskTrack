const prisma = require('../config/prisma');

exports.createTask = async (req, res) => {
    const { title, description, assigned_to_id, deadline } = req.body;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                deadline: new Date(deadline),
                assigned_to_id: parseInt(assigned_to_id),
                created_by_id: req.user.id,
            },
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'MANAGER') {
            tasks = await prisma.task.findMany({
                include: { assigned_to: { select: { name: true, email: true } } },
            });
        } else {
            tasks = await prisma.task.findMany({
                where: { assigned_to_id: req.user.id },
            });
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Members can only update their own tasks
        if (req.user.role === 'MEMBER' && task.assigned_to_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
