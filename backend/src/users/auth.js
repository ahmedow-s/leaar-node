// auth.js - Контроллер для аутентификации
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

// Функция регистрации
async function register(userData) {
  try {
    // Проверяем, не существует ли пользователь
    let existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Создаем нового пользователя
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || null,
      age: userData.age || null
    });

    // Сохраняем в БД
    await user.save();
    
    // Генерируем токен
    const token = generateToken(user._id);
    
    // Возвращаем пользователя без пароля
    const userObj = user.toObject();
    delete userObj.password;
    
    return { user: userObj, token };
  } catch (err) {
    throw new Error(err.message || 'Registration failed');
  }
}

// Функция логина
async function login(email, password) {
  try {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    // Ищем пользователя и выбираем пароль
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Проверяем пароль
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Генерируем токен
    const token = generateToken(user._id);
    
    // Возвращаем пользователя без пароля
    const userObj = user.toObject();
    delete userObj.password;
    
    return { user: userObj, token };
  } catch (err) {
    throw new Error(err.message || 'Login failed');
  }
}

// Генерация JWT токена
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '24h' });
}

// Верификация токена (middleware)
function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      hint: 'Add Authorization header: Authorization: Bearer YOUR_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ 
      error: 'Invalid or expired token',
      message: err.message
    });
  }
}

module.exports = {
  register,
  login,
  authenticateToken
};