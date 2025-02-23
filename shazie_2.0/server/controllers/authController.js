const {
  User,
  Project,
  Task,
  Comment,
  Commit,
  VersionControl,
  Team,
} = require("../models/user");
const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const hi = (req, res) => {
  res.json("hi");
};
const logoutUser = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json("logged out");
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
      password: hashedPassword,
    });

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
        { email: user.email, id: user._id, name: user.name },
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
  const { name, password, phoneNumber, id } = req.body;
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be at least 6 characters length",
    });
  }
  //check if passowrd is good
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be at least 6 characters length",
    });
  }
  const hashedPassword = await hashPassword(password);
  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          password: hashedPassword,
          phoneNumber: phoneNumber,
        },
      }
    );
    return res.json({ status: "ok", data: "updated" });
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

    // Create new team
    const team = await Team.create({
      teamName: name,
      members: allMembers, // Store member IDs
      projects: [],
      createdBy: creatorId,
    });

    // Save the team to the database
    await team.save();

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getTeams = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Find teams where the user is either a member or the creator
    const teams = await Team.find({
      $or: [{ members: userId }, { createdBy: userId }],
    })
      .populate("members", "name email") // Populate member details
      .populate("createdBy", "name email") // Populate creator details
      .populate("projects", "projectName"); // Populate associated projects (if needed)

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
};
