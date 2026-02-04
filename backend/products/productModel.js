// productModel.js - Модель продукта для базы данных
// Аналогично userModel, но для продуктов.
// Продукт имеет поля: name, price, description, category.
// Для изучения: timestamps добавляют createdAt и updatedAt автоматически.

const mongoose = require('mongoose');

// Схема продукта
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Обязательное поле
    trim: true // Убирает лишние пробелы
  },
  price: {
    type: Number,
    required: true,
    min: 0 // Цена не может быть отрицательной
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Автоматически добавляет createdAt и updatedAt
});

// Модель Product
// Используется для создания, чтения, обновления и удаления документов в коллекции 'products'
const Product = mongoose.model('Product', productSchema);

// Экспортируем модель
module.exports = Product;