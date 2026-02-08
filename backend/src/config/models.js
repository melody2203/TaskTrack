const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('MANAGER', 'MEMBER'),
        defaultValue: 'MEMBER',
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'DONE'),
        defaultValue: 'PENDING',
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

// Relationships
User.hasMany(Task, { as: 'tasks_assigned', foreignKey: 'assigned_to_id' });
Task.belongsTo(User, { as: 'assigned_to', foreignKey: 'assigned_to_id' });

User.hasMany(Task, { as: 'tasks_created', foreignKey: 'created_by_id' });
Task.belongsTo(User, { as: 'created_by', foreignKey: 'created_by_id' });

module.exports = { User, Task, sequelize };
