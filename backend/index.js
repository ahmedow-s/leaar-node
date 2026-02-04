// index.js - Главный файл сервера
// Обновлено: добавлена аутентификация, отправка сообщений, платежи.
// Для изучения: используйте middleware authenticateToken для защищенных маршрутов.

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Импортируем контроллеры и сервисы
const userController = require('./users/users');
const productController = require('./products/products');
const authController = require('./users/auth');
const emailService = require('./utils/emailService');
const smsService = require('./utils/smsService');
const paymentService = require('./utils/payment');

const app = express();
const port = 3000;

// Middleware для парсинга JSON тел запросов
// express.json() преобразует JSON в объекте req.body
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Маршруты для пользователей
// GET /users/:id - получить пользователя по ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users - создать нового пользователя
app.post('/users', async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /users/:id - обновить пользователя
app.put('/users/:id', async (req, res) => {
  try {
    const user = await userController.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /users/:id - удалить пользователя
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await userController.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Маршруты аутентификации
// POST /register - Регистрация
app.post('/register', async (req, res) => {
  try {
    const { user, token } = await authController.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /login - Логин
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authController.login(email, password);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Защищенные маршруты пользователей
// PUT /users/change-password - Изменение пароля
app.put('/users/change-password', authController.authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await userController.changePassword(req.userId, oldPassword, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Маршруты для отправки сообщений
// POST /send-email - Отправка email
app.post('/send-email', authController.authenticateToken, async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await emailService.sendEmail(to, subject, text);
    res.json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /send-sms - Отправка SMS
app.post('/send-sms', authController.authenticateToken, async (req, res) => {
  try {
    const { to, message } = req.body;
    await smsService.sendSMS(to, message);
    res.json({ message: 'SMS sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Маршруты платежей
// POST /create-payment-intent - Создание платежного намерения
app.post('/create-payment-intent', authController.authenticateToken, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount, currency);
    res.json(paymentIntent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Маршруты для продуктов
// GET /products - получить все продукты
app.get('/products', async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id - получить продукт по ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await productController.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /products - создать новый продукт
app.post('/products', async (req, res) => {
  try {
    const product = await productController.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /products/:id - обновить продукт
app.put('/products/:id', async (req, res) => {
  try {
    const product = await productController.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /products/:id - удалить продукт
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await productController.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.send('Добро пожаловать в API с аутентификацией, сообщениями и платежами!');
});

// Запуск сервера
// app.listen() запускает сервер на указанном порту
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});