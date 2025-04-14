const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { createNotification } = require("./notificationController");
const { hashPassword } = require("../helpers/auth");
const { Notification } = require('../models/notification'); // Import the Notification model

// Get user settings
const getUserSettings = async (req, res) => {
  try {
    // User ID is available from the JWT token via req.user.id
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ settings: user });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update profile information
const updateProfile = async (req, res) => {
  try {
    // User ID is available from the JWT token via req.user.id
    const userId = req.user.id;
    const { name, bio, profilePicture } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          name: name || undefined,
          bio: bio || undefined,
          profilePicture: profilePicture || undefined
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    // User ID is available from the JWT token via req.user.id
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    // Create notification with valid enum values
    // Based on the error, we need to use valid enum values that exist in your schema
    await createNotification(
      userId,
      "WELCOME", // Using a known valid type from your schema
      'Your password has been successfully updated.',
      userId, // Using the user's ID as the related entity
      "User" // Using a known valid model from your schema
    );
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { emailNotifications, pushNotifications, taskReminders } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "preferences.emailNotifications":
            emailNotifications !== undefined ? emailNotifications : undefined,
          "preferences.pushNotifications":
            pushNotifications !== undefined ? pushNotifications : undefined,
          "preferences.taskReminders":
            taskReminders !== undefined ? taskReminders : undefined,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Notification preferences updated successfully",
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete account (critical operation)
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    // Validate input
    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }
    
    // Get user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }
    
    // Delete user's data from related collections
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Remove user from teams
      if (mongoose.models.Team) {
        await mongoose.models.Team.updateMany(
          { members: userId },
          { $pull: { members: userId } },
          { session }
        );
      }
      
      // Delete user's tasks
      if (mongoose.models.Task) {
        await mongoose.models.Task.deleteMany({ assignedTo: userId }, { session });
      }
      
      // Delete user's notifications - use the imported model
      await Notification.deleteMany({ recipient: userId }, { session });
      
      // Finally delete the user
      await User.findByIdAndDelete(userId, { session });
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getUserSettings,
  updateProfile,
  updatePassword,
  updateNotificationPreferences,
  deleteAccount,
};
