// emailService.js - Сервис для отправки email
const nodemailer = require('nodemailer');
require('dotenv').config();

// Настройка транспортера
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_app_password'
  }
});

// Функция для отправки email
async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@leaar.com',
      to: to,
      subject: subject,
      text: text,
      html: `<p>${text}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send email: ' + error.message);
  }
}

module.exports = {
  sendEmail
};