/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               age:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (invalid input)
 *       500:
 *         description: Server error
 *
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 *
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Refresh token required
 *       401:
 *         description: Invalid refresh token
 *
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     description: Logout current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 *
 * /api/auth/verify-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify token validity
 *     description: Check if current token is valid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       403:
 *         description: Invalid or expired token
 */

// ============ AUTHENTICATION ROUTES ============
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenService');
const { authenticateToken } = require('../middleware/auth');
const { 
  isValidEmail, 
  isValidPassword, 
  isValidName, 
  isValidPhone, 
  isValidAge 
} = require('../utils/validation');
require('dotenv').config();

const router = express.Router();

// ============ REGISTER ============
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, age } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    if (!isValidName(name)) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 2 and 100 characters'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid phone number'
      });
    }

    if (age && !isValidAge(age)) {
      return res.status(400).json({
        success: false,
        error: 'You must be at least 13 years old'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone ? phone.trim() : null,
      age: age || null
    });

    await user.save();

    // Generate tokens 
    // const accessToken = generateAccessToken(user._id);
    // const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      accessToken,
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

// ============ LOGIN ============
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    await user.save();

    res.json({
      success: true,
      message: 'Logged in successfully',
      user: user.toJSON(),
      accessToken,
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

// ============ CREATE ADMIN (protected) ============
// Use this endpoint from Postman or CI to create an initial admin account.
// Requires `ADMIN_SECRET` in `.env` and the secret sent in body `adminKey`.
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, adminKey, phone, age } = req.body;

    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, error: 'Invalid admin key' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    const admin = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone || null,
      age: age || null,
      role: 'admin',
      isVerified: true
    });

    await admin.save();

    const accessToken = generateAccessToken(admin._id);

    return res.status(201).json({ success: true, message: 'Admin created', user: admin.toJSON(), accessToken });
  } catch (err) {
    console.error('Create admin error:', err.message);
    res.status(500).json({ success: false, error: err.message || 'Failed to create admin' });
  }
});

// ============ REFRESH TOKEN ============
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const accessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken,
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

// ============ LOGOUT ============
router.post('/logout', authenticateToken, (req, res) => {
  // Token is removed on client side
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ============ VERIFY TOKEN ============
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    userId: req.userId
  });
});

module.exports = router;
