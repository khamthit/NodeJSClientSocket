const { io } = require("socket.io-client");
const axios = require("axios"); // Import axios

// Make the Socket.IO server URL configurable via environment variable
// The CORS error suggests your server might be at http://10.0.100.31:8042
const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || "http://localhost:8042";
console.log(`[Client] Connecting to Socket.IO server at: ${SOCKET_SERVER_URL}`);

// Connect to the Socket.IO server
const socket = io(SOCKET_SERVER_URL);

// Emit the "username" event with a username
socket.emit("username", "Khamthit 2", "Messages from client");

// Listen for the "update socketData" event
socket.on("update socketData by client", (data) => {
  console.log("[Client] Received 'update socketData by client':", data);
});

async function fetchSocketData() {
  try {
    // Construct API URL based on the Socket server URL
    // This assumes the API is hosted on the same base URL and port as the Socket.IO server
    const apiUrl = new URL("/api/socketData", SOCKET_SERVER_URL).toString();
    console.log(`[Client] Fetching data from API: ${apiUrl}`);

    const response = await axios.get(apiUrl);

    if (response && response.data) {
      console.log("[Client] Data fetched from API:", response.data);
      // Validate the data before emitting
      const { id, username, Message } = response.data;
      if (id && username && Message) {
        socket.emit("socketData", response.data);
        console.log("[Client] Emitted 'socketData' to server:", response.data);
      } else {
        console.error("[Client] Invalid data structure from API:", response.data);
      }
    } else {
      console.error("[Client] No data in response from API or empty response.");
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("[Client] API Error Response:", error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("[Client] API No Response:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("[Client] API Request Setup Error:", error.message);
    }
  }
}

// Call fetchSocketData once when the client connects to the server
socket.on("connect", () => {
  console.log(`[Client] Connected to server with ID: ${socket.id}. Fetching initial data...`);
  fetchSocketData();
});

//this event is triggered when the server emits "Add socketData" or add data in postman then showing data by real-time
socket.on("Add socketData", () => {
  console.log("[Client] Received 'Add socketData' from server. Fetching updated data...");
  fetchSocketData();
});

//this fect data from server and save it to a file
socket.on("add attachfile socketData", () => {
  console.log("[Client] Received 'add attachfile socketData' from server. Fetching updated data...");
  fetchSocketData();
});

socket.on("connect_error", (err) => {
  console.error(`[Client] Connection Error: ${err.message}`, err.data ? err.data : '');
});

socket.on("disconnect", (reason) => {
  console.log(`[Client] Disconnected: ${reason}`);
  if (reason === "io server disconnect") {
    // The server forcibly disconnected; we may need to reconnect manually
    socket.connect();
  }
});
