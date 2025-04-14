const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} = require("../controllers/notificationController");

router.get("/user/:userId", getUserNotifications);
router.put("/read/:notificationId", markNotificationAsRead);
router.put("/read-all/:userId", markAllNotificationsAsRead);
router.get("/unread-count/:userId", getUnreadCount);

module.exports = router;
