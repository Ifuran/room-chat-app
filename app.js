const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8000;

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./index.html"));
});

const users = {};

io.on("connection", (socket) => {
  socket.on("join", () => {
    const username = "User_" + Math.random().toString(36).substring(2, 6);
    users[socket.id] = username;
    io.emit("userOnline", { username, userOnline: Object.keys(users).length });
    socket.broadcast.emit("userJoined", username + " has joined the chat");
  });

  socket.on("message", (msg) => {
    const name = users[socket.id];
    io.emit("message", { name, msg });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id] || "Unknown";
    delete users[socket.id];
    io.emit("userLeft", name + " has left the chat");
    io.emit("updateUserOnline", Object.keys(users).length);
  });
});

server.listen(port, () => {
  console.log(`Chat app running on http://localhost:${port}`);
});
