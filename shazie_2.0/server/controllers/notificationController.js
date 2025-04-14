const { Notification } = require("../models/notification");
const { User } = require("../models/user");

// Create a new notification
const createNotification = async (
  recipientId,
  type,
  content,
  relatedTo = null,
  onModel = null
) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      content,
      relatedTo,
      onModel,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("relatedTo")
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    res.status(500).json({ error: "Failed to count notifications" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
};
