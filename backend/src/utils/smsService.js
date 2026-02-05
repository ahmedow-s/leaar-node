// smsService.js - Сервис для отправки SMS
const twilio = require('twilio');
require('dotenv').config();

let client = null;

// Инициализация Twilio клиента только если есть правильные учетные данные
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Функция для отправки SMS
async function sendSMS(to, message) {
  try {
    if (!client) {
      console.warn('⚠️  Twilio не сконфигурирован. SMS не будет отправлена.');
      return { 
        success: false, 
        message: 'Twilio is not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env',
        isMock: true
      };
    }

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to: to
    });

    console.log('✅ SMS sent:', sms.sid);
    return { success: true, message: 'SMS sent successfully', sid: sms.sid };
  } catch (error) {
    console.error('❌ SMS error:', error.message);
    throw new Error('Failed to send SMS: ' + error.message);
  }
}

module.exports = {
  sendSMS
};