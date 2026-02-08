const { Task, User } = require('../config/models');

exports.createTask = async (req, res) => {
    const { title, description, assigned_to_id, deadline } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            deadline: new Date(deadline),
            assigned_to_id: parseInt(assigned_to_id),
            created_by_id: req.user.id,
        });
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [
                { model: User, as: 'assigned_to', attributes: ['name', 'email'] },
                { model: User, as: 'created_by', attributes: ['name'] }
            ],
        });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findByPk(id);

        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (req.user.role === 'MEMBER' && task.assigned_to_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        task.status = status;
        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
