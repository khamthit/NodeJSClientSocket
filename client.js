const { io } = require("socket.io-client");
const axios = require("axios"); // Import axios
const fs = require("fs");

// Connect to the Socket.IO server
const socket = io("http://localhost:3001");

// Emit the "username" event with a username
socket.emit("username", "Khamthit 2", "Messages from client");

// Listen for the "update socketData" event
socket.on("update socketData by client", (data) => {
  console.log("Updated socket data by client:", data);
});

async function fetchSocketData() {
  try {
    const response = await axios.get("http://localhost:3001/api/socketData");
    if (!response) {
      console.log("Socket data fetched from API-Server:", response.data);
    }
    // Validate the data before emitting
    const { id, username, Message } = response.data;
    if (id && username && Message) {
      socket.emit("socketData", response.data);
      console.log("Socket data sent to server:", response.data);
    } else {
      console.error("Invalid data fetched from API:", response.data);
    }
  } catch (error) {
    console.error("Error fetching socket data:", error.message);
  }
}
// Call fetchSocketData once when the client connects to the server
socket.on("connect", () => {
  // console.log("Connected to the server. Fetching socket data...");
  fetchSocketData();
});
//this event is triggered when the server emits "Add socketData" or add data in postman then showing data by real-time
socket.on("Add socketData", () => {
  //console.log("New data available from server. Fetching...");
  fetchSocketData();
});

//this fect data from server and save it to a file
socket.on("add attachfile socketData", () => {
  //console.log("New data available from server. Fetching...");
  fetchSocketData();
});

