// products.js - Контроллер для операций с продуктами
const productModel = require('../models/productModel');

// Функция для создания нового продукта
async function createProduct(productData) {
  try {
    const product = new productModel({
      name: productData.name,
      price: productData.price,
      description: productData.description || '',
      category: productData.category || 'General',
      stock: productData.stock || 0,
      image: productData.image || null
    });

    await product.save();
    return product;
  } catch (err) {
    throw new Error(err.message || 'Failed to create product');
  }
}

// Функция для получения продукта по ID
async function getProductById(productId) {
  try {
    const product = await productModel.findById(productId);
    return product;
  } catch (err) {
    throw new Error('Failed to get product');
  }
}

// Функция для обновления продукта по ID
async function updateProduct(productId, updateData) {
  try {
    const product = await productModel.findByIdAndUpdate(
      productId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return product;
  } catch (err) {
    throw new Error('Failed to update product');
  }
}

// Функция для удаления продукта по ID
async function deleteProduct(productId) {
  try {
    const product = await productModel.findByIdAndDelete(productId);
    return product;
  } catch (err) {
    throw new Error('Failed to delete product');
  }
}

// Функция для получения всех продуктов
async function getAllProducts() {
  try {
    const products = await productModel.find();
    return products;
  } catch (err) {
    throw new Error('Failed to get products');
  }
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts
};