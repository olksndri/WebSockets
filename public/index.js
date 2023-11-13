import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const usersList = document.getElementById("users");
const userName = document.getElementById("msg_name");
const userMessage = document.getElementById("msg_txt");
const sendButton = document.getElementById("msg_btn");
const messagesList = document.getElementById("msgs");

const socket = io();
const messages = [];
const users = [];
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

const renderListOfMessages = (updatedMessage) => {
  messages.push(updatedMessage);

  const li = document.createElement("li");
  li.classList.add("msgs_item");

  const name = document.createElement("p");
  const message = document.createElement("p");
  name.textContent = updatedMessage.name;
  message.textContent = updatedMessage.message;

  li.append(name, message);

  messagesList.append(li);
};

const renderListOfUsers = (user) => {
  const id = Object.keys(user)[0];
  let isUpdate = false;
  let index;

  for (let i = 0; i < users.length; i++) {
    if (users[i][id]) {
      isUpdate = true;
      index = i;
      break;
    }
  }

  if (isUpdate) {
    users.splice(index, 1, user);
  } else {
    users.push(user);
  }

  const activeUsers = users
    .filter((el) => {
      return Object.keys(el).length > 0;
    })
    .map((el) => {
      const li = document.createElement("li");
      li.classList.add("user");
      li.textContent = Object.values(el)[0];
      return li;
    });

  usersList.innerHTML = "";
  usersList.append(...activeUsers);
};

socket.on("message", renderListOfMessages);
socket.on("user", renderListOfUsers);
