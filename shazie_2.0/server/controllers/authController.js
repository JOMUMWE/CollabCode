const {
  User,
  Project,
  Task,
  Comment,
  Commit,
  VersionControl,
  Team,
} = require("../models/user");
const { v4 } = require("uuid");
const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const { createNotification } = require("./notificationController");
const path = require("path");

const hi = (req, res) => {
  res.json("shaboozieeee");
};
const logoutUser = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json("logged out");
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    //check if name has been entered
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    //check email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      role,
      password: hashedPassword,
    });

    // Create welcome notification
    await createNotification(
      user._id,
      "WELCOME",
      `Welcome to CollabCode, ${name}! 😊 We're excited to have you on board.`,
      user._id,
      "User"
    );
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        {
          email: user.email,
          id: user._id,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    }
    if (!match) {
      res.json({
        error: "password do not match",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(false);
  }
};

const updateProfile = async (req, res) => {
  const { img, id } = req.body;
  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          profilePic: img,
        },
      }
    );
    return res.json({ status: "ok", data: "updated" });
  } catch (error) {
    return res.json({ error: error });
  }
};

const updateUser = async (req, res) => {
  const { id, name, email, phone, role } = req.body;
  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          email: email,
          phone: phone,
          role: role,
        },
      }
    );
    return res.json({ status: "ok", data: "profile updated" });
  } catch (error) {
    return res.json({ error: error });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, emails, creatorId } = req.body;
    if (!name || !emails || emails.length === 0) {
      return res
        .status(400)
        .json({ error: "Team name and at least one email are required" });
    }

    // Find users by emails
    const members = await User.find({ email: { $in: emails } });

    if (members.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid users found for these emails" });
    }

    // Find the creator in the database
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    const allMembers = [
      ...new Set([creator._id, ...members.map((user) => user._id)]),
    ];
    const roomid = v4();
    // Create new team
    const team = await Team.create({
      teamName: name,
      members: allMembers, // Store member IDs
      projects: [],
      createdBy: creatorId,
      roomId: roomid,
    });

    // Save the team to the database
    await team.save();
    // After team creation, notify all team members
    for (const memberId of team.members) {
      if (memberId.toString() !== team.createdBy.toString()) {
        await createNotification(
          memberId,
          "TEAM_ADDED",
          `You've been added to the team "${team.teamName}" by ${creator.name}.`,
          team._id,
          "Team"
        );
      }
    }
    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getTeams = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find teams where the user is either a member or the creator
    const teams = await Team.find({
      $or: [{ members: userId }, { createdBy: userId }],
    })
      .populate("members", "name email") // Populate member details
      .populate("createdBy", "name email _id") // Populate creator details
      .populate("projects", "projectName"); // Populate associated projects

    if (!teams.length) {
      return res.status(404).json({ message: "No teams found for this user" });
    }

    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const validate_email = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePic = async (req, res) => {
  const { image, id } = req.body;

  // Optional: Add validation for image size if needed
  // const base64Size = Buffer.from(image.split(',')[1], 'base64').length;
  // if (base64Size > 10 * 1024 * 1024) { // 10MB
  //   return res.status(400).json({ error: "Image size exceeds the 10MB limit" });
  // }

  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          profilePic: image,
        },
      }
    );
    return res.json({ status: "ok", data: "updated" });
  } catch (error) {

    console.error("Error updating profile picture:", error);
    return res.status(500).json({ error: "Failed to update profile picture" });
  }

};
// Endpoint to get profile picture
const getProfilePic = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user || !user.profilePic) {
      return res.status(404).json({ error: "Profile picture not found" });
    }
    res.json({ profilePic: user.profilePic });
  } catch (error) {
    return res.json({ error: error });
  }
};

const createProject = async (req, res) => {
  try {
    const { projectName, description, startDate, endDate, teamName } = req.body;

    // Find the team by name
    const team = await Team.findOne({ teamName });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Generate unique projectID
    const projectID = v4();

    // Create new project
    const project = await Project.create({
      projectID,
      projectName,
      description,
      startDate,
      endDate,
      teamId: team._id,
    });

    // Add project to team's projects array
    await Team.findByIdAndUpdate(team._id, {
      $push: { projects: project._id },
    });

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const validateTeam = async (req, res) => {
  const { teamName } = req.query;
  try {
    const team = await Team.findOne({ teamName });
    if (team) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Endpoint to fetch projects for a user
const getProjects = async (req, res) => {
  const { userId } = req.query; // Pass the user ID as a query parameter

  try {
    // Check if userId is provided and valid
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Find teams where the user is a member
    const teams = await Team.find({ members: userId });

    if (!teams || teams.length === 0) {
      return res.status(404).json({ error: "No teams found for the user" });
    }

    // Extract team IDs
    const teamIds = teams.map((team) => team._id);

    // Find projects associated with the user's teams
    const projects = await Project.find({ teamId: { $in: teamIds } }).populate(
      "teamId"
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};


const addFileToProject = async (req, res) => {
  const { roomId, filename, content, uploadedBy } = req.body;

  try {
    // Find the team associated with the room
    const team = await Team.findOne({ roomId });
    if (!team) {
      return res.status(404).json({ error: "Team not found for this room" });
    }

    // Find the project associated with the team
    const project = await Project.findOne({ teamId: team._id });
    if (!project) {
      return res.status(404).json({ error: "No project found for this team" });
    }

    // Add the file to the project's files array
    const newFile = {
      name: filename, // Changed from filename to name
      content,
      uploadedBy,
      type: getFileType(filename), // Add a function to determine file type based on extension
    };
    project.files.push(newFile);
    await project.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to determine file type based on extension
const getFileType = (filename) => {
  const extension = path.extname(filename).toLowerCase();

  // Map common extensions to file types
  const typeMap = {
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".json": "json",
    ".md": "markdown",
    ".py": "python",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".php": "php",
    ".rb": "ruby",
    ".go": "go",
    ".txt": "text",
  };

  return typeMap[extension] || "text"; // Default to 'text' if extension is not recognized
};


const getFilesForRoom = async (req, res) => {
  const { roomId } = req.query;

  try {
    // Find the team associated with the room
    const team = await Team.findOne({ roomId });
    if (!team) {
      return res.status(404).json({ error: "Team not found for this room" });
    }

    // Find the project associated with the team
    const project = await Project.findOne({ teamId: team._id });
    if (!project) {
      return res.status(404).json({ error: "No project found for this team" });
    }

    // Add debugging to see what's in the files array
    console.log("Files in project:", project.files);

    // Return the files associated with the project
    res.status(200).json({ files: project.files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addTaskToProject = async (req, res) => {
  const { projectId, taskName, status, dueDate, createdBy, assignedTo } =
    req.body;

  try {
    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Check if the project exists
    const project = await Project.findById(projectId).populate("teamId");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the assignedTo email exists and is part of the team
    let assignedToUser = null;
    if (assignedTo) {
      assignedToUser = await User.findOne({ email: assignedTo });
      if (!assignedToUser) {
        return res.status(404).json({ error: "Assigned user not found" });
      }

      // Check if the user is part of the team
      const isMember = project.teamId.members.some(
        (memberId) => memberId.toString() === assignedToUser._id.toString()
      );
      if (!isMember) {
        return res.status(403).json({ error: "User is not part of the team" });
      }
    }

    // Generate unique taskID
    const taskID = v4();

    // Create a new task
    const task = await Task.create({
      taskID,
      taskName,
      status,
      projectId,
      dueDate,
      createdBy,
      assignedTo: assignedToUser ? assignedToUser._id : null,
    });

    // Add the task to the project's tasks array
    await Project.findByIdAndUpdate(projectId, {
      $push: { tasks: task._id },
    });

    if (task.assignedTo) {
      await createNotification(
        task.assignedTo,
        "TASK_ASSIGNED",
        `You've been assigned a new task "${task.taskName}" in project "${project.projectName}".`,
        task._id,
        "Task"
      );
    }
    res.status(201).json({ message: "Task added successfully", task });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTasksForProject = async (req, res) => {
  const { projectId } = req.query;

  try {
    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Find tasks associated with the project
    const tasks = await Task.find({ projectId })
      .populate("createdBy", "name")
      .populate("assignedTo", "name");

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for this project" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const validateEmailForProject = async (req, res) => {
  const { email, projectId } = req.query;

  try {
    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Check if the project exists
    const project = await Project.findById(projectId).populate("teamId");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is part of the team
    const isMember = project.teamId.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ error: "User is not part of the team" });
    }

    res.status(200).json({ valid: true, userId: user._id });
  } catch (error) {
    console.error("Error validating email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveFile = async (req, res) => {
  const { roomId, filename, content } = req.body;

  try {
    // Find the team associated with the room
    const team = await Team.findOne({ roomId });
    if (!team) {
      return res.status(404).json({ error: "Team not found for this room." });
    }

    // Find the project associated with the team
    const project = await Project.findOne({ teamId: team._id });
    if (!project) {
      return res.status(404).json({ error: "No project found for this team." });
    }

    // Check if the file already exists
    const existingFile = project.files.find((file) => file.name === filename);
    if (existingFile) {
      // Update the file content
      existingFile.content = content;
    } else {
      // Add a new file with required fields
      project.files.push({
        type: "file", // Ensure the type is set
        name: filename, // Ensure the name is set
        content: content,
      });
    }

    // Save the project
    await project.save();

    // Emit the saved file to all users in the room
    req.app.get("io").to(roomId).emit("file saved", {
      filename,
      content,
    });

    res.status(200).json({ message: "File saved successfully." });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ error: "Failed to save file." });
  }
};

const createFileOrFolder = async (req, res) => {
  const { projectId, type, name, content, parentId, uploadedBy } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const newFileOrFolder = {
      type,
      name,
      content: type === "file" ? content : undefined,
      parentId: parentId || null,
      uploadedBy,
    };

    project.files.push(newFileOrFolder);
    await project.save();

    res
      .status(201)
      .json({ message: `${type} created successfully`, newFileOrFolder });
  } catch (error) {
    console.error("Error creating file or folder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFilesAndFolders = async (req, res) => {
  const { roomId, parentId } = req.query;

  try {
    // Find the team associated with the roomId
    const team = await Team.findOne({ roomId });
    if (!team) {
      return res.status(404).json({ error: "Team not found for this room." });
    }

    // Find the project associated with the team
    const project = await Project.findOne({ teamId: team._id });
    if (!project) {
      return res.status(404).json({ error: "No project found for this team." });
    }

    // Filter files and folders based on parentId
    const filesAndFolders = project.files.filter(
      (item) =>
        item.parentId?.toString() === parentId || (!parentId && !item.parentId)
    );

    res.status(200).json(filesAndFolders);
  } catch (error) {
    console.error("Error fetching files and folders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateFile = async (req, res) => {
  const { projectId, fileId, content } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const file = project.files.id(fileId);
    if (!file || file.type !== "file") {
      return res.status(404).json({ error: "File not found" });
    }

    file.content = content;
    await project.save();

    res.status(200).json({ message: "File updated successfully", file });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFileOrFolder = async (req, res) => {
  const { projectId, fileId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.files = project.files.filter(
      (file) => file._id.toString() !== fileId
    );
    await project.save();

    res.status(200).json({ message: "File or folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting file or folder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  hi,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  updateUser,
  createTeam,
  getTeams,
  validate_email,
  updateProfilePic,
  getProfilePic,
  createProject,
  getProjects,
  validateTeam,
  addFileToProject,
  getFilesForRoom,
  addTaskToProject,
  getTasksForProject,
  validateEmailForProject,
  saveFile,
  createFileOrFolder,
  getFilesAndFolders,
  updateFile,
  deleteFileOrFolder,
};
