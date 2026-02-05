  // index.js - Главный файл сервера
  const express = require('express');
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');
  require('dotenv').config();

  // Подключение к MongoDB
  const connectDB = require('./src/config/db');
  connectDB();

  // Импортируем маршруты
  const authRoutes = require('./src/routes/authRoutes');
  const userRoutes = require('./src/routes/userRoutes');
  const productRoutes = require('./src/routes/productRoutes');
  const messagingRoutes = require('./src/routes/messagingRoutes');
  const paymentRoutes = require('./src/routes/paymentRoutes');

  const app = express();
  const port = process.env.PORT || 3000;

  // ============ MIDDLEWARE ============
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============ SWAGGER ДОКУМЕНТАЦИЯ ============
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // ============ API МАРШРУТЫ ============
  // Аутентификация
  app.use('/auth', authRoutes);

  // Вспомогательные redirect маршруты для удобства
  app.post('/register', (req, res) => {
    res.status(301).json({
      error: 'Use /auth/register instead',
      redirect: 'POST /auth/register',
      hint: 'All auth routes are under /auth prefix'
    });
  });

  app.post('/login', (req, res) => {
    res.status(301).json({
      error: 'Use /auth/login instead',
      redirect: 'POST /auth/login',
      hint: 'All auth routes are under /auth prefix'
    });
  });

  // Пользователи
  app.use('/users', userRoutes);

  // Продукты
  app.use('/products', productRoutes);

  // Сообщения (Email, SMS)
  app.use('/messaging', messagingRoutes);

  // Платежи
  app.use('/payments', paymentRoutes);

  // ============ КОРНЕВОЙ МАРШРУТ ============
  app.get('/', (req, res) => {
    res.json({
      message: '🎉 Добро пожаловать в API Leaar!',
      version: '1.0.0',
      documentation: `http://localhost:${port}/api-docs`,
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login'
        },
        users: {
          getAll: 'GET /users',
          getById: 'GET /users/:id',
          create: 'POST /users',
          update: 'PUT /users/:id',
          delete: 'DELETE /users/:id',
          changePassword: 'PUT /users/change-password'
        },
        products: {
          getAll: 'GET /products',
          getById: 'GET /products/:id',
          create: 'POST /products',
          update: 'PUT /products/:id',
          delete: 'DELETE /products/:id'
        },
        messaging: {
          sendEmail: 'POST /messaging/email',
          sendSMS: 'POST /messaging/sms'
        },
        payments: {
          createIntent: 'POST /payments/intent'
        }
      }
    });
  });

  // ============ ОБРАБОТКА ОШИБОК 404 ============
  app.use((req, res) => {
    res.status(404).json({
      error: 'Route not found',
      path: req.path,
      method: req.method,
      availableEndpoints: 'Visit http://localhost:' + port + '/api-docs'
    });
  });

  // ============ ОБРАБОТКА ОШИБОК ============
  app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      path: req.path
    });
  });

  // ============ ЗАПУСК СЕРВЕРА ============
  app.listen(port, () => {
    console.log('\n🚀 ========================================');
    console.log(`🚀 Server started on port ${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
    console.log('🚀 ========================================\n');
  });

  module.exports = app;
