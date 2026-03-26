// tokenService.js - Сервис для работы с токенами
const jwt = require('jsonwebtoken');

// Генерация JWT токена
const generateToken = (userId, role = 'user', expiresIn = '24h') => {
  return jwt.sign(
    { userId, role }, 
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn }
  );
};

// Генерация рефреш токена
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );
};

// Верификация токена
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
  } catch (err) {
    return null;
  }
};

// Декодирование токена без верификации
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken
};
