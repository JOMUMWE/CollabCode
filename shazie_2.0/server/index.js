const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(bodyParser.json());
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// ✅ Use authentication routes
app.use("/", require("./routes/authRoutes"));

//github login logic
const CLIENT_SECRET = "6e01d1e3a20862e0e560aa9144b9bf500bcd0548";
const CLIENT_ID = "Ov23lisfPDlM75x2Tfg5";

app.get("/getAccessToken", async (req, res) => {
  const code = req.query.code;

  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    code;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    mathod: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});

app.get("/checkTeamProjects", async (req, res) => {
  const { teamId } = req.query;

  try {
    // Check if the team has any projects
    const projects = await Project.find({ teamId });
    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for the team" });
    }

    res.status(200).json({ message: "Projects found", projects });
  } catch (error) {
    console.error("Error checking team projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getUserData", async (req, res) => {
  req.get("Authorization");
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      res.json(data);
    });
});
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  },
});

const socketID_to_Users_Map = {};
const roomID_to_Code_Map = {};

async function getUsersinRoom(roomId, io) {
  const socketList = await io.in(roomId).allSockets();
  const userslist = [];
  socketList.forEach((each) => {
    each in socketID_to_Users_Map &&
      userslist.push(socketID_to_Users_Map[each].username);
  });

  return userslist;
}

async function updateUserslistAndCodeMap(io, socket, roomId) {
  socket.in(roomId).emit("member left", {
    username: socketID_to_Users_Map[socket.id].username,
  });

  // update the user list
  delete socketID_to_Users_Map[socket.id];
  const userslist = await getUsersinRoom(roomId, io);
  socket.in(roomId).emit("updating client list", { userslist: userslist });

  userslist.length === 0 && delete roomID_to_Code_Map[roomId];
}

//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  console.log("A user connected", socket.id);

  socket.on("when a user joins", async ({ roomId, username }) => {
    console.log("username: ", username);
    socketID_to_Users_Map[socket.id] = { username };
    socket.join(roomId);

    const userslist = await getUsersinRoom(roomId, io);

    // for other users, updating the client list
    socket.in(roomId).emit("updating client list", { userslist: userslist });

    // for this user, updating the client list
    io.to(socket.id).emit("updating client list", { userslist: userslist });

    // send the latest code changes to this user when joined to existing room
    if (roomId in roomID_to_Code_Map) {
      io.to(socket.id).emit("on language change", {
        languageUsed: roomID_to_Code_Map[roomId].languageUsed,
      });
      io.to(socket.id).emit("on code change", {
        code: roomID_to_Code_Map[roomId].code,
      });
    }

    // alerting other users in room that new user joined
    socket.in(roomId).emit("new member joined", {
      username,
    });
  });

  // for other users in room to view the changes
  socket.on("update language", ({ roomId, languageUsed }) => {
    if (roomId in roomID_to_Code_Map) {
      roomID_to_Code_Map[roomId]["languageUsed"] = languageUsed;
    } else {
      roomID_to_Code_Map[roomId] = { languageUsed };
    }
  });

  socket.on("tab opened", ({ roomId, tab }) => {
    // Broadcast the tab opened event to other users in the room
    socket.to(roomId).emit("tab opened", { tab });
  });

  // for user editing the code to reflect on his/her screen
  socket.on("syncing the language", ({ roomId }) => {
    if (roomId in roomID_to_Code_Map) {
      socket.in(roomId).emit("on language change", {
        languageUsed: roomID_to_Code_Map[roomId].languageUsed,
      });
    }
  });

  socket.on("update code", ({ roomId, filename, code }) => {
    if (roomId in roomID_to_Code_Map) {
      // Update the code for the specific file in the room
      if (!roomID_to_Code_Map[roomId][filename]) {
        roomID_to_Code_Map[roomId][filename] = {};
      }
      roomID_to_Code_Map[roomId][filename].code = code;
    } else {
      roomID_to_Code_Map[roomId] = {
        [filename]: { code },
      };
    }

    // Broadcast the code change to other users in the room
    socket.to(roomId).emit("on code change", { filename, code });
  });

  // for user editing the code to reflect on his/her screen
  socket.on("syncing the code", ({ roomId }) => {
    if (roomId in roomID_to_Code_Map) {
      socket
        .in(roomId)
        .emit("on code change", { code: roomID_to_Code_Map[roomId].code });
    }
  });

  // Enhanced WebRTC signaling handlers
  socket.on("webrtc-offer", (data) => {
    console.log(`Relaying offer from ${socket.id} to ${data.target}`);
    socket.to(data.target).emit("webrtc-offer", {
      sdp: data.sdp,
      caller: socket.id,
      roomId: data.roomId, // Add room tracking
    });
  });

  socket.on("webrtc-answer", (data) => {
    console.log(`Relaying answer from ${socket.id} to ${data.target}`);
    socket.to(data.target).emit("webrtc-answer", {
      sdp: data.sdp,
      caller: socket.id,
      roomId: data.roomId,
    });
  });

  socket.on("webrtc-ice-candidate", (data) => {
    console.log(`Relaying ICE candidate from ${socket.id} to ${data.target}`);
    socket.to(data.target).emit("webrtc-ice-candidate", {
      candidate: data.candidate,
      caller: socket.id,
      roomId: data.roomId,
    });
  });

  // Handle disconnections for WebRTC cleanup
  socket.on("disconnect", function () {
    console.log("A user disconnected:", socket.id);
    // Notify other peers to cleanup connections
    socket.broadcast.emit("peer-disconnected", {
      peerId: socket.id,
    });
  });

  socket.on("leave room", ({ roomId }) => {
    socket.leave(roomId);
    updateUserslistAndCodeMap(io, socket, roomId);
  });

  socket.on("disconnecting", (reason) => {
    socket.rooms.forEach((eachRoom) => {
      if (eachRoom in roomID_to_Code_Map) {
        updateUserslistAndCodeMap(io, socket, eachRoom);
      }
    });
  });

  socket.on("chat message", ({ roomId, message, username }) => {
    socket.to(roomId).emit("chat message", {
      username,
      message,
    });
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database connected!"))
  .catch((err) => console.log("❌ Database not connected", err));

const PORT = 8000;

server.listen(PORT, function () {
  console.log(`listening on port : ${PORT}`);
});
