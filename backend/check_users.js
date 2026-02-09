
const { User } = require('./src/config/models');
const { sequelize } = require('./src/config/models');

async function checkUser() {
    try {
        const email = 'merertuphilip@gmail.com';
        const user = await User.findOne({ where: { email } });

        if (user) {
            console.log(`User found: ${user.name} (${user.email})`);
            console.log(`Role: ${user.role}`);
            console.log(`User ID: ${user.id}`);
        } else {
            console.log(`User with email ${email} NOT found.`);
        }
    } catch (err) {
        console.error('Error checking user:', err);
    } finally {
        await sequelize.close();
    }
}

checkUser();
