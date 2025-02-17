const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors())
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("database connected!");
  })
    .catch((err) => console.log("Database not connected", err));
  

const CLIENT_URL = "https://5173-jomumwe-collabcode-kswko7rn7zm.ws-eu117.gitpod.io";

// ✅ Handle preflight requests explicitly
app.use((req, res,next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
});


app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

app.use("/", require("./routes/authRoutes"));
const port = 8000;
app.listen(port, () => console.log(`server is running on port ${port}`));