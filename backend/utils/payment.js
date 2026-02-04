// payment.js - Сервис для платежей с Stripe
// Использует Stripe для обработки платежей.
// Для изучения: настройте STRIPE_SECRET_KEY в .env.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Функция создания платежного намерения
// Принимает amount (в центах), currency
// Возвращает client_secret для фронтенда
async function createPaymentIntent(amount, currency = 'usd') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency
  });
  return { client_secret: paymentIntent.client_secret };
}

// Функция подтверждения платежа (опционально)
async function confirmPayment(paymentIntentId) {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
  return paymentIntent;
}

module.exports = {
  createPaymentIntent,
  confirmPayment
};