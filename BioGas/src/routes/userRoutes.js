/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     description: Get current user profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: User not found
 *
 * /api/users/update-profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update current user profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               phone:
 *                 type: string
 *                 example: "+9876543210"
 *               age:
 *                 type: integer
 *                 example: 26
 *               bio:
 *                 type: string
 *                 example: "Updated bio"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *
 * /api/users/change-password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change user password
 *     description: Change password for current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or new password same as old
 *       401:
 *         description: Old password incorrect or unauthorized
 *       404:
 *         description: User not found
 *
 * /api/users/delete-account:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user account
 *     description: Permanently delete current user account (requires password confirmation)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Password required
 *       401:
 *         description: Incorrect password or unauthorized
 *       404:
 *         description: User not found
 */

// ============ USER ROUTES ============
const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { isValidName, isValidPhone, isValidAge } = require('../utils/validation');

const router = express.Router();

// ============ GET PROFILE ============
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch profile'
    });
  }
});

// ============ UPDATE PROFILE ============
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, age, bio, avatar } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate and update fields
    if (name) {
      if (!isValidName(name)) {
        return res.status(400).json({
          success: false,
          error: 'Name must be between 2 and 100 characters'
        });
      }
      user.name = name.trim();
    }

    if (phone) {
      if (!isValidPhone(phone)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid phone number'
        });
      }
      user.phone = phone.trim();
    }

    if (age) {
      if (!isValidAge(age)) {
        return res.status(400).json({
          success: false,
          error: 'You must be at least 13 years old'
        });
      }
      user.age = age;
    }

    if (bio) {
      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          error: 'Bio cannot exceed 500 characters'
        });
      }
      user.bio = bio.trim();
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to update profile'
    });
  }
});

// ============ CHANGE PASSWORD ============
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Old password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'New passwords do not match'
      });
    }

    // Get user with password
    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check old password
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Old password is incorrect'
      });
    }

    // Check if new password is same as old
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from old password'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to change password'
    });
  }
});

// ============ DELETE ACCOUNT ============
router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required to delete account'
      });
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Password is incorrect'
      });
    }

    await User.findByIdAndDelete(req.userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (err) {
    console.error('Delete account error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to delete account'
    });
  }
});

module.exports = router;
