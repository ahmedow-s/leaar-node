const express = require('express');
const router = express.Router();
const userController = require('../users/users');
const authController = require('../users/auth');

// PUT /users/change-password - Изменение пароля (должен быть перед /:id)
router.put('/change-password', authController.authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await userController.changePassword(req.userId, oldPassword, newPassword);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /users - получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await require('../models/userModel').find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/:id - получить пользователя по ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /users - создать нового пользователя
router.post('/', async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /users/:id - обновить пользователя
router.put('/:id', async (req, res) => {
  try {
    const user = await userController.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /users/:id - удалить пользователя
router.delete('/:id', async (req, res) => {
  try {
    const user = await userController.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
