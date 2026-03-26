// authMiddleware.js - Middleware для защиты маршрутов
const jwt = require('jsonwebtoken');

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access denied. No token provided.',
      hint: 'Add Authorization header: Authorization: Bearer YOUR_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false,
      error: 'Invalid or expired token',
      message: err.message
    });
  }
};

// Middleware для проверки прав админа
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      error: 'Admin access required'
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeAdmin
};
