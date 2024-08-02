const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Email = require('./models/email');
// Setup Nodemailer transporterconst cron = require('node-cron');
// Setup Nodemailer transporter
const moment = require('moment'); // For date manipulation

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any other email service
  auth: {
    user: process.env.EMAIL_USER, // your email address from environment variables
    pass: process.env.EMAIL_PASS  // your email password from environment variables
  }
});

// Function to send an email
const sendEmail = async (email) => {
  try {
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.recipient,
      subject: email.subject,
      text: email.body,
      attachments: email.attachments.map(att => ({
        filename: att.filename,
        path: att.path
      }))
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    // Update the email status to 'sent'
    email.status = 'sent';
    await email.save();
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Helper function to get day number from day name
const dayNameToNumber = (dayName) => {
  const days = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  return days[dayName];
};

// Function to schedule emails
const scheduleEmails = async () => {
  const emails = await Email.find({ status: 'scheduled' });

  emails.forEach(email => {
    const scheduleTime = moment(email.schedule_time);
    const now = moment();

    if (email.is_recurring) {
      const { type, details } = email.recurrence;

      if (type === 'daily') {
        details.daily.forEach(time => {
          const [hour, minute] = time.split(':');
          cron.schedule(`${minute} ${hour} * * *`, () => sendEmail(email));
        });
      } else if (type === 'weekly') {
        details.weekly.days.forEach(day => {
          const [hour, minute] = details.weekly.time.split(':');
          const dayNumber = dayNameToNumber(day);
          cron.schedule(`${minute} ${hour} * * ${dayNumber}`, () => sendEmail(email));
        });
      } else if (type === 'monthly') {
        const [hour, minute] = details.monthly.time.split(':');
        cron.schedule(`${minute} ${hour} ${details.monthly.day} * *`, () => sendEmail(email));
      } else if (type === 'quarterly') {
        const [hour, minute] = details.quarterly.time.split(':');
        cron.schedule(`${minute} ${hour} ${details.quarterly.day} */3 *`, () => sendEmail(email));
      }
    } else {
      // Calculate the time difference in minutes
      const diffMinutes = scheduleTime.diff(now, 'minutes');
      if (diffMinutes > 0) {
        setTimeout(() => sendEmail(email), diffMinutes * 60 * 1000);
      }
    }
  });
};

// Export the scheduleEmails function
module.exports = {
  scheduleEmails
};
