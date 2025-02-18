const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();

const CLIENT_URL = "http://localhost:5173";

// ✅ Correct CORS Configuration
app.use(cors({
  origin: CLIENT_URL,
  credentials: true, // Allow sending cookies & authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle Preflight Requests Properly
app.options("*", cors());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database connected!"))
  .catch(err => console.log("❌ Database not connected", err));

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// ✅ Use authentication routes
app.use("/", require("./routes/authRoutes"));

const port = 8000;
app.listen(port, () => console.log(`✅ Server is running on port ${port}`));
