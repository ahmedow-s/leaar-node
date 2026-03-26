// authRoutesEnhanced.js - Расширенные маршруты аутентификации
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { generateToken, generateRefreshToken } = require('../utils/tokenService');
const { authenticateToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ============ РЕГИСТРАЦИЯ ============
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, age } = req.body;

    // Валидация входных данных
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    // Проверка пароля
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Passwords do not match'
      });
    }

    // Проверка, существует ли пользователь
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Создание нового пользователя
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone || null,
      age: age || null
    });

    // Сохранение в БД
    await user.save();
    
    // Генерация токенов
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Возврат данных без пароля
    const userObj = user.toObject();
    delete userObj.password;
    
    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: userObj, 
      token,
      refreshToken,
      expiresIn: '24h'
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Registration failed'
    });
  }
});

// ============ ВХОД ============
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required'
      });
    }

    // Поиск пользователя с выбором пароля
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Генерация токенов
    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    
    // Возврат данных без пароля
    const userObj = user.toObject();
    delete userObj.password;
    
    return res.json({ 
      success: true,
      message: 'Logged in successfully',
      user: userObj, 
      token,
      refreshToken,
      expiresIn: '24h'
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Login failed'
    });
  }
});

// ============ ПРОВЕРКА ЛОГИНА (ПОЛУЧЕНИЕ ПРОФИЛЯ) ============
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found'
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ 
      success: true,
      user: userObj
    });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to fetch profile'
    });
  }
});

// ============ ОБНОВЛЕНИЕ ПРОФИЛЯ ============
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, age } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found'
      });
    }

    // Обновление полей
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (age) user.age = age;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: userObj
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to update profile'
    });
  }
});

// ============ ИЗМЕНЕНИЕ ПАРОЛЯ ============
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Валидация
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Old password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'New passwords do not match'
      });
    }

    // Получение пользователя с паролем
    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found'
      });
    }

    // Проверка старого пароля
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Old password is incorrect'
      });
    }

    // Проверка, не совпадает ли новый пароль со старым
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false,
        error: 'New password must be different from the old password'
      });
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    return res.json({ 
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to change password'
    });
  }
});

// ============ ОБНОВЛЕНИЕ ТОКЕНА ============
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Refresh token is required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found'
      });
    }

    const token = generateToken(user._id, user.role);
    
    return res.json({ 
      success: true,
      token,
      expiresIn: '24h'
    });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    res.status(401).json({ 
      success: false,
      error: 'Invalid refresh token'
    });
  }
});

// ============ ЛОГАУТ ============
router.post('/logout', authenticateToken, (req, res) => {
  // В простой реализации логаут происходит на клиенте (удаление токена)
  // Для более сложных случаев можно использовать blacklist токенов
  return res.json({ 
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
