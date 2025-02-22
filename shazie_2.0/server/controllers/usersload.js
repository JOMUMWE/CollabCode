const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const {User} = require("../models/user"); // Import User model
require("dotenv").config(); // Load environment variables

const SALT_ROUNDS = 12;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.log("❌ Database not connected", err));

// Read JSON file
const usersData = JSON.parse(fs.readFileSync("MOCK_DATA(1).json", "utf-8"));

async function importUsers() {
  try {
    for (const user of usersData) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        await User.create({ ...user, password: hashedPassword });
        console.log(`✅ User ${user.name} added`);
      } else {
        console.log(`⚠️ User ${user.email} already exists`);
      }
    }
    console.log("✅ All users processed.");
    mongoose.connection.close(); // Close DB connection
  } catch (error) {
    console.error("❌ Error inserting users:", error);
    mongoose.connection.close();
  }
}

// Run import function
importUsers();
