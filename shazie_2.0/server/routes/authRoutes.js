const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/authController");

router.get("/", hi);
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

module.exports = router;
