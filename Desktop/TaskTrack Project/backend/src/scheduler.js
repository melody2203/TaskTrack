const cron = require('node-cron');
const { Task, User } = require('./config/models');
const { sendReminderEmail } = require('./services/emailService');
const { Op } = require('sequelize');

// Schedule to run every day at 9:00 AM
// Format: minute hour day-of-month month day-of-week
const initScheduler = () => {
    console.log('Task Reminder Scheduler Initialized...');

    // For testing/demonstration, you can use '*/1 * * * *' to run every minute
    // Running every day at 9 AM: '0 9 * * *'
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily task reminder check...');
        try {
            const pendingTasks = await Task.findAll({
                where: {
                    status: {
                        [Op.ne]: 'DONE' // Not equals to 'DONE'
                    }
                },
                include: [{
                    model: User,
                    as: 'assigned_to',
                    attributes: ['name', 'email']
                }]
            });

            console.log(`Found ${pendingTasks.length} incomplete tasks. Checking deadlines...`);

            const now = new Date();
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(now.getDate() + 3);

            for (const task of pendingTasks) {
                const deadlineDate = new Date(task.deadline);

                // Check if deadline is within the next 3 days and hasn't passed already
                const isNearingDeadline = deadlineDate <= threeDaysFromNow && deadlineDate >= now;

                if (isNearingDeadline && task.assigned_to && task.assigned_to.email) {
                    await sendReminderEmail(
                        task.assigned_to.email,
                        task.assigned_to.name,
                        task.title,
                        task.deadline
                    );
                }
            }
        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    });

    // Optional: Immediate check on startup (for testing)
    // runImmediateCheck();
};

const runImmediateCheck = async () => {
    console.log('Running immediate reminder check...');
    // Same logic as cron...
};

module.exports = { initScheduler };
