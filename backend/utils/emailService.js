// emailService.js - Сервис для отправки email
// Использует nodemailer для отправки писем.
// Для изучения: настройте EMAIL_USER и EMAIL_PASS в .env.

const nodemailer = require('nodemailer');
require('dotenv').config();

// Настройка транспортера
const transporter = nodemailer.createTransport({
  service: 'gmail', // Или другой сервис
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Функция отправки email
// Принимает to, subject, text
async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent to', to);
}

module.exports = { sendEmail };