const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.sendReminderEmail = async (userEmail, userName, taskTitle, deadline) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: userEmail,
        subject: `🔔 Task Reminder: ${taskTitle}`,
        text: `Hi ${userName},\n\nThis is a reminder that the task "${taskTitle}" is still pending and is due on ${new Date(deadline).toLocaleDateString()}.\n\nPlease update the status when possible.\n\nBest,\nTaskTrack Team`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2563eb;">Task Reminder</h2>
                <p>Hi <strong>${userName}</strong>,</p>
                <p>This is a friendly reminder that you have a task that needs attention:</p>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e293b;">${taskTitle}</p>
                    <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Deadline: ${new Date(deadline).toLocaleDateString()}</p>
                </div>
                <p>Please log in to the dashboard to update your progress.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #94a3b8;">You received this because you are assigned to this task in TaskTrack.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${userEmail}:`, error.message);
    }
};
