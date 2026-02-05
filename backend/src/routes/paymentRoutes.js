const express = require('express');
const router = express.Router();
const authController = require('../users/auth');
const paymentService = require('../utils/payment');

// POST /create-payment-intent - Создание платежного намерения
router.post('/intent', authController.authenticateToken, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount, currency);
    res.json(paymentIntent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
