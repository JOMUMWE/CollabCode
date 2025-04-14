const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// All routes require authentication
router.use(auth);

// Get user settings
router.get('/', settingsController.getUserSettings);

// Update profile information
router.put('/profile', settingsController.updateProfile);

// Update password
router.put('/password', settingsController.updatePassword);

// Update notification preferences
router.put('/notifications', settingsController.updateNotificationPreferences);


// Delete account (critical operation)
router.delete('/account', settingsController.deleteAccount);

module.exports = router;

