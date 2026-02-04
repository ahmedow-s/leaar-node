// products.js - Контроллер для операций с продуктами
// Содержит функции CRUD для продуктов.
// Для изучения: каждая функция асинхронная и использует модель для взаимодействия с БД.
// Добавлена функция getAllProducts для получения списка всех продуктов.

const productModel = require('./productModel');

// Функция для создания нового продукта
// Принимает productData: {name, price, description, category}
// Возвращает созданный продукт
async function createProduct(productData) {
    const product = new productModel(productData);
    return await product.save();
}

// Функция для получения продукта по ID
async function getProductById(productId) {
    return await findById(productId);
}

// Функция для обновления продукта по ID
async function updateProduct(productId, updateData) {
    return await findByIdAndUpdate(productId, updateData, { new: true });
}

// Функция для удаления продукта по ID
async function deleteProduct(productId) {
    return await findByIdAndDelete(productId);
}

// Функция для получения всех продуктов
// Возвращает массив всех продуктов из БД
async function getAllProducts() {
    return await find();
}

// Экспортируем функции для маршрутов
module.exports = {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts
};