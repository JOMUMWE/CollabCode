const mongoose = require("mongoose");
const { Schema } = mongoose;

//User Schema
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: String,
  role: String,
  password: String,
  profilePic: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
});

const projectSchema = new mongoose.Schema({
  projectID: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  files: [
    {
      filename: { type: String, required: true },
      content: { type: String, required: true }, // File content
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

const taskSchema = new mongoose.Schema({
  taskID: { type: String, required: true, unique: true },
  taskName: { type: String, required: true },
  status: { type: String, required: true },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  dueDate: { type: Date, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  commentID: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  datePosted: { type: Date, default: Date.now },
});

// Commit Schema
const commitSchema = new mongoose.Schema({
  commitID: { type: String, required: true, unique: true },
  commitMessage: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateCommitted: { type: Date, default: Date.now },
});

// Version Control Schema
const versionControlSchema = new mongoose.Schema({
  repoID: { type: String, required: true, unique: true },
  repoName: { type: String, required: true },
  commitHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Commit" }],
});

//team Schema
const TeamSchema = new mongoose.Schema({
  teamID: String,
  teamName: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  roomId: String,
});

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  active: { type: Boolean, default: true },
});

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  Project: mongoose.model("Project", projectSchema),
  Task: mongoose.model("Task", taskSchema),
  Comment: mongoose.model("Comment", commentSchema),
  Commit: mongoose.model("Commit", commitSchema),
  VersionControl: mongoose.model("VersionControl", versionControlSchema),
  Team: mongoose.model("Team", TeamSchema),
  Room: mongoose.model("Room", RoomSchema),
  Contact: mongoose.model("Contact", contactSchema),
};

