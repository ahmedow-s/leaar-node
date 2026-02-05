const express = require('express');
const router = express.Router();
const authController = require('../users/auth');
const emailService = require('../utils/emailService');
const smsService = require('../utils/smsService');

// POST /send-email - Отправка email
router.post('/email', authController.authenticateToken, async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await emailService.sendEmail(to, subject, text);
    res.json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /send-sms - Отправка SMS
router.post('/sms', authController.authenticateToken, async (req, res) => {
  try {
    const { to, message } = req.body;
    await smsService.sendSMS(to, message);
    res.json({ message: 'SMS sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
