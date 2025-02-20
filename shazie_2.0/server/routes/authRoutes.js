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
} = require("../controllers/authController");

router.get("/", hi);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.get("/logout", logoutUser);
router.post("/updateUser", updateUser);
router.post("/team", createTeam);
router.get("/teams/:userId", getTeams);

module.exports = router;
