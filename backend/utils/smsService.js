// smsService.js - Сервис для отправки SMS
// Использует Twilio для отправки сообщений.
// Для изучения: настройте TWILIO_* в .env.

const twilio = require('twilio');
require('dotenv').config();

// Функция отправки SMS
// Принимает to (номер телефона), message
async function sendSMS(to, message) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
  console.log('SMS sent to', to);
}

module.exports = { sendSMS };