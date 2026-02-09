const { User, sequelize } = require('./src/config/models');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const email = 'merertuphilip@gmail.com';
        const newPassword = 'password123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            return;
        }

        user.password = hashedPassword;
        await user.save();

        console.log(`Password for ${email} has been successfully reset to: ${newPassword}`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await sequelize.close();
    }
}

resetPassword();
