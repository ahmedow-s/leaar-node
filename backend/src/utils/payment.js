// payment.js - Сервис для платежей
let stripe = null;

// Инициализация Stripe только если есть секретный ключ
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  // Mock Stripe для тестирования
  stripe = null;
}

// Функция для создания платежного намерения
async function createPaymentIntent(amount, currency = 'usd') {
  try {
    if (!stripe) {
      console.warn('⚠️  Stripe не сконфигурирован. Используется mock режим.');
      return {
        success: false,
        message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in .env',
        isMock: true,
        clientSecret: 'pi_mock_' + Math.random().toString(36).substr(2, 9),
        id: 'pi_mock_' + Math.random().toString(36).substr(2, 9)
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: ['card']
    });

    console.log('✅ Payment intent created:', paymentIntent.id);
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } catch (error) {
    console.error('❌ Payment error:', error.message);
    throw new Error('Failed to create payment intent: ' + error.message);
  }
}

module.exports = {
  createPaymentIntent
};