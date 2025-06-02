const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./index.html"));
});

let userOnline = 0;
const users = {};

io.on("connection", (socket) => {
  userOnline++;
  const username = "User " + userOnline;
  users[socket.id] = username;
  socket.emit("yourName", { username, userOnline });
  // socket.broadcast.emit("userJoined", username + " has joined the chat");
  // socket.on("message", (msg) => {
  //   const name = users[socket.id];
  //   io.emit("message", { name, msg });
  // });
  // socket.on("disconnect", () => {
  //   const name = users[socket.id];
  //   delete users[socket.id];
  //   userOnline--;
  //   io.emit("userLeft", name + " has left the chat");
  //   io.emit("updateUserOnline", userOnline);
  // });
});

server.listen(port, () => {
  console.log(`Chat app running on http://localhost:${port}`);
});
