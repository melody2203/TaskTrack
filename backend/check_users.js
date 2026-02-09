const { User } = require('./src/config/models');
const sequelize = require('./src/config/db');

async function listUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const users = await User.findAll();
        console.log('Users found:', users.map(u => ({ id: u.id, email: u.email, role: u.role, password_preview: u.password ? u.password.substring(0, 20) + '...' : 'NO_PASSWORD' })));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

listUsers();
