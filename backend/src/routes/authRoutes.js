const express = require('express');
const router = express.Router();
const authController = require('../users/auth');

// POST /auth/register - Регистрация
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    // Валидация
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'name, email, and password are required'
      });
    }

    const { user, token } = await authController.register({
      name,
      email,
      password,
      phone,
      age
    });

    res.status(201).json({ 
      success: true,
      user, 
      token 
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(400).json({ 
      error: err.message,
      details: 'Registration failed'
    });
  }
});

// POST /auth/login - Логин
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'email and password are required'
      });
    }

    const { user, token } = await authController.login(email, password);
    
    res.json({ 
      success: true,
      user, 
      token 
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ 
      error: err.message,
      details: 'Login failed'
    });
  }
});

module.exports = router;
