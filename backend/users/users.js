// users.js - Контроллер для операций с пользователями
// Этот файл содержит функции для создания, чтения, обновления и удаления пользователей.
// Эти функции используют модель User для взаимодействия с базой данных MongoDB.
// Для изучения: каждая функция асинхронная, использует await для ожидания операций с БД.
// Ошибки обрабатываются с помощью try-catch в маршрутах (не здесь, для простоты).

const userModel = require('./userModel');

// Функция для создания нового пользователя
// Принимает объект userData с полями name, email, age
// Возвращает созданного пользователя или выбрасывает ошибку
async function createUser(userData) {
    // Создаем новый экземпляр модели User с переданными данными
    const user = new userModel(userData);
    // Сохраняем пользователя в базе данных и возвращаем результат
    return await user.save();
}

// Функция для получения пользователя по ID
// Принимает userId (строку или ObjectId)
// Возвращает пользователя или null, если не найден
async function getUserById(userId) {
    // Ищем пользователя по ID в базе данных
    return await findById(userId);
}

// Функция для обновления пользователя по ID
// Принимает userId и объект updateData с полями для обновления
// Возвращает обновленного пользователя или null, если не найден
async function updateUser(userId, updateData) {
    // Находим и обновляем пользователя, возвращаем новый документ (new: true)
    return await findByIdAndUpdate(userId, updateData, { new: true });
}

// Функция для удаления пользователя по ID
// Принимает userId
// Возвращает удаленного пользователя или null, если не найден
async function deleteUser(userId) {
    // Находим и удаляем пользователя по ID
    return await findByIdAndDelete(userId);
}

// Функция для изменения пароля
// Принимает userId, oldPassword, newPassword
// Проверяет старый пароль и обновляет на новый
async function changePassword(userId, oldPassword, newPassword) {
  const user = await findById(userId);
  if (!user) throw new Error('User not found');
  if (!(await user.comparePassword(oldPassword))) {
    throw new Error('Old password is incorrect');
  }
  user.password = newPassword; // Хешируется автоматически в pre-save
  await user.save();
  return { message: 'Password changed successfully' };
}

// Экспортируем функции
module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  changePassword
};
