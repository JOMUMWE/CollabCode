const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/authController");
const { submitContactForm } = require("../controllers/contact");
const { getRepositories, getRepoFiles, getFileContent, saveFileContent } = require("../controllers/gitfilesController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.get("/logout", logoutUser);
router.post("/updateUser", updateUser);
router.post("/team", createTeam);
router.get("/teams/:userId", getTeams);
router.get("/validate-email", validate_email);
router.post("/updateProfilePic", updateProfilePic);
router.get("/getProfilePic/:id", getProfilePic);
router.post("/createProject", createProject);
router.get("/getProjects", getProjects);
router.get("/validateTeamName", validateTeam);
router.post("/uploadFile", addFileToProject);
router.get("/getFilesForRoom", getFilesForRoom);
router.post("/addTask", addTaskToProject);
router.get("/getTasks", getTasksForProject);
router.get("/validateEmailForProject", validateEmailForProject);
router.post("/submitContactForm", submitContactForm);
router.post("/saveFile", saveFile);
router.post("/createFileOrFolder", createFileOrFolder);
router.get("/getFilesAndFolders", getFilesAndFolders);
router.put("/updateFile", updateFile);
router.delete("/deleteFileOrFolder", deleteFileOrFolder);
router.get("/getRepositories", getRepositories);
router.get("/getRepoFiles", getRepoFiles);
router.get("/getFileContent", getFileContent);
router.post("/saveFileContent", saveFileContent);

module.exports = router;
