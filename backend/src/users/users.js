// users.js - Контроллер для операций с пользователями
const userModel = require('../models/userModel');

// Функция для создания нового пользователя
async function createUser(userData) {
  try {
    // Проверяем, не существует ли пользователь
    let existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = new userModel({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || null,
      age: userData.age || null
    });

    await user.save();
    
    // Возвращаем без пароля
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  } catch (err) {
    throw new Error(err.message || 'Failed to create user');
  }
}

// Функция для получения пользователя по ID
async function getUserById(userId) {
  try {
    const user = await userModel.findById(userId).select('-password');
    return user;
  } catch (err) {
    throw new Error('Failed to get user');
  }
}

// Функция для обновления пользователя по ID
async function updateUser(userId, updateData) {
  try {
    // Не позволяем изменять пароль через эту функцию
    if (updateData.password) {
      delete updateData.password;
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return user;
  } catch (err) {
    throw new Error('Failed to update user');
  }
}

// Функция для удаления пользователя по ID
async function deleteUser(userId) {
  try {
    const user = await userModel.findByIdAndDelete(userId);
    return user;
  } catch (err) {
    throw new Error('Failed to delete user');
  }
}

// Функция для изменения пароля
async function changePassword(userId, oldPassword, newPassword) {
  try {
    const user = await userModel.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Проверяем старый пароль
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    // Устанавливаем новый пароль
    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  } catch (err) {
    throw new Error(err.message || 'Failed to change password');
  }
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  changePassword
};
