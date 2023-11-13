const express = require("express");
const path = require("path");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.resolve(__dirname, "public")));

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const users = {};

io.sockets.on("connection", (client) => {
  const broadcast = (event, data) => {
    client.emit(event, data);
    client.broadcast.emit(event, data);
  };

  broadcast("user", users);

  client.on("message", (message) => {
    if (users[client.id] !== message.name) {
      users[client.id] = message.name;
      broadcast("user", users);
    }
    broadcast("message", message);
  });

  client.on("disconnect", () => {
    delete users[client.id];
    client.broadcast.emit("user", users);
  });
});
