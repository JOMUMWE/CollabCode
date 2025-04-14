const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["WELCOME", "TEAM_ADDED", "TASK_ASSIGNED", "PROJECT_CREATED"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "onModel",
  },
  onModel: {
    type: String,
    enum: ["User", "Team", "Task", "Project"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("DevNotification", notificationSchema);

module.exports = { Notification };
