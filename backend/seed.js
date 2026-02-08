const { User, sequelize } = require('./src/config/models');
const bcrypt = require('bcryptjs');

async function seed() {
    await sequelize.sync({ force: true });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Manager
    await User.create({
        name: 'Project Manager',
        email: 'manager@example.com',
        password: hashedPassword,
        role: 'MANAGER',
    });

    // Create Member
    await User.create({
        name: 'Team Member',
        email: 'member@example.com',
        password: hashedPassword,
        role: 'MEMBER',
    });

    console.log('Database seeded successfully!');
    console.log('Manager: manager@example.com / password123');
    console.log('Member: member@example.com / password123');
}

seed().catch(err => {
    console.error('Error seeding database:', err);
});
