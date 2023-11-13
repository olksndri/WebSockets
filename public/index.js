import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const usersList = document.getElementById("users");
const userName = document.getElementById("msg_name");
const userMessage = document.getElementById("msg_txt");
const sendButton = document.getElementById("msg_btn");
const messagesList = document.getElementById("msgs");

const socket = io();
const messages = [];
const LIMIT_MESSAGES = 10;

const sendMessage = () => {
  const message = userMessage.value.trim();
  const name = userName.value.trim();
  if (message === "" || name === "") {
    return;
  }
  socket.emit("message", { message, name });
};

sendButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  sendMessage();
});

document.addEventListener("keydown", (evt) => {
  if (evt.code === 13) {
    sendMessage();
  }
});

const renderListOfMessages = (newMessage) => {
  messages.push(newMessage);

  const li = document.createElement("li");
  li.classList.add("msgs_item");

  const name = document.createElement("p");
  const message = document.createElement("p");

  name.textContent = newMessage.name;
  message.textContent = newMessage.message;
  li.append(name, message);
  messagesList.append(li);
};

const renderListOfUsers = (users) => {
  if (Object.keys(users).length === 0) {
    return;
  }

  const activeUsers = [];

  for (let key in users) {
    const li = document.createElement("li");
    li.classList.add("user");
    li.textContent = users[key];

    activeUsers.push(li);
  }

  usersList.innerHTML = "";
  usersList.append(...activeUsers);
};

socket.on("message", renderListOfMessages);
socket.on("user", renderListOfUsers);
