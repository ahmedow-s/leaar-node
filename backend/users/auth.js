// auth.js - Контроллер для аутентификации
// Содержит функции для регистрации, логина, генерации токенов.
// Для изучения: JWT токены используются для аутентификации без хранения сессий.

const jwt = require('jsonwebtoken');
const User = require('./userModel');
require('dotenv').config();

// Функция регистрации
// Принимает userData: {name, email, password, phone, age}
// Создает пользователя и возвращает токен
async function register(userData) {
  const user = new User(userData);
  await user.save();
  const token = generateToken(user._id);
  return { user, token };
}

// Функция логина
// Принимает email и password
// Проверяет пароль и возвращает токен
async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = generateToken(user._id);
  return { user, token };
}

// Генерация JWT токена
// Для изучения: токен содержит ID пользователя, подписан секретным ключом.
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Верификация токена (middleware)
// Для изучения: проверяет токен и добавляет user в req
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = {
  register,
  login,
  authenticateToken
};