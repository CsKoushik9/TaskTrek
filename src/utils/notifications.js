// Email notification service with multiple protocol support
export const notificationService = {
  // Email protocols: SMTP, SendGrid API, AWS SES, Nodemailer
  sendNotification: async (watchers, taskId, message) => {
    watchers.forEach(async (watcher) => {
      // Console simulation
      console.log(
        `📧 Email sent to ${watcher.email}: ${message} for task ${taskId}`
      );

      // Real email implementation options:
      // await this.sendSMTP(watcher.email, message, taskId);
      // await this.sendSendGrid(watcher.email, message, taskId);
      // await this.sendAWSSES(watcher.email, message, taskId);

      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('TaskTrek Notification', {
          body: `${message} for task ${taskId}`,
          icon: '/favicon.ico',
        });
      }
    });
  },

  // SMTP Protocol (using Nodemailer)
  sendSMTP: async (email, message, taskId) => {
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({
    //   host: 'smtp.gmail.com', port: 587, secure: false,
    //   auth: { user: 'your-email@gmail.com', pass: 'app-password' }
    // });
    // await transporter.sendMail({
    //   from: 'TaskTrek <noreply@tasktrek.com>',
    //   to: email, subject: `TaskTrek: Task ${taskId} Updated`,
    //   html: `<p>${message}</p>`
    // });
  },

  // SendGrid API
  sendSendGrid: async (email, message, taskId) => {
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: email, from: 'noreply@tasktrek.com',
    //   subject: `TaskTrek: Task ${taskId} Updated`,
    //   html: `<p>${message}</p>`
    // });
  },

  // AWS SES
  sendAWSSES: async (email, message, taskId) => {
    // const AWS = require('aws-sdk');
    // const ses = new AWS.SES({ region: 'us-east-1' });
    // await ses.sendEmail({
    //   Source: 'noreply@tasktrek.com', Destination: { ToAddresses: [email] },
    //   Message: {
    //     Subject: { Data: `TaskTrek: Task ${taskId} Updated` },
    //     Body: { Html: { Data: `<p>${message}</p>` } }
    //   }
    // }).promise();
  },

  requestPermission: () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  notifyWatchers: (taskId, action, taskTitle) => {
    try {
      const watchers = JSON.parse(
        localStorage.getItem(`tasktrek_watchers_${taskId}`) || '[]'
      );
      if (watchers.length > 0) {
        const message = `Task "${taskTitle}" has been ${action}`;
        notificationService.sendNotification(watchers, taskId, message);
      }
    } catch (error) {
      // Handle invalid JSON gracefully
      console.error('Error parsing watchers from localStorage:', error);
    }
  },
};

// Request notification permission on load
notificationService.requestPermission();
