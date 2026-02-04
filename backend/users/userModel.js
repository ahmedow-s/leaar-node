// userModel.js - Модель пользователя для базы данных
// Обновлено: добавлены поля password, phone, role для аутентификации и дополнительных функций.
// Для изучения: password хешируется с помощью bcrypt перед сохранением.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Определяем схему пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Обязательное поле
    trim: true // Убирает пробелы в начале и конце
  },
  email: {
    type: String,
    required: true,
    unique: true, // Уникальное значение
    lowercase: true // Преобразует в нижний регистр
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Минимум 6 символов
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Роли: пользователь или админ
    default: 'user'
  },
  age: {
    type: Number,
    min: 0 // Минимальное значение 0
  },
  isVerified: {
    type: Boolean,
    default: false // Для верификации email или телефона
  }
}, {
  timestamps: true // Автоматически добавляет поля createdAt и updatedAt
});

// Middleware для хеширования пароля перед сохранением
// Для изучения: pre('save') выполняется перед сохранением документа.
// Если пароль изменен, хешируем его.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод для проверки пароля
// Для изучения: comparePassword сравнивает введенный пароль с хешированным.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Создаем модель на основе схемы
const User = mongoose.model('User', userSchema);

// Экспортируем модель для использования в других файлах
module.exports = User;