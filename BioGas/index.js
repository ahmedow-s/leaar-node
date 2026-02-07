// ============ MAIN SERVER FILE ============
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
require('dotenv').config();

// Database connection
const connectDB = require('./src/config/db');
connectDB();

// Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ SWAGGER DOCUMENTATION ============
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs.json'
  }
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BioGas Backend is running',
    timestamp: new Date().toISOString()
  });
});

// ============ ROOT ROUTE ============
app.get('/', (req, res) => {
  res.json({
    message: '🔐 BioGas Authentication Backend',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    health: `http://localhost:${PORT}/health`,
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        refreshToken: 'POST /api/auth/refresh-token',
        verifyToken: 'POST /api/auth/verify-token'
      },
      users: {
        getProfile: 'GET /api/users/me',
        updateProfile: 'PUT /api/users/update-profile',
        changePassword: 'PUT /api/users/change-password',
        deleteAccount: 'DELETE /api/users/delete-account'
      }
    }
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/auth`);
});
