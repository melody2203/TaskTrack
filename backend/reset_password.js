const bcrypt = require('bcryptjs');
const { User } = require('./src/config/models');
const { sequelize } = require('./src/config/models');

async function resetPassword() {
    try {
        const email = 'merertuphilip@gmail.com';
        const newPassword = 'password123';

        console.log(`Resetting password for ${email}...`);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [updatedRows] = await User.update(
            { password: hashedPassword },
            { where: { email } }
        );

        if (updatedRows > 0) {
            console.log('Password reset successfully.');
        } else {
            console.log('User not found or password not updated.');
        }
    } catch (err) {
        console.error('Error resetting password:', err);
    } finally {
        await sequelize.close();
    }
}

resetPassword();
