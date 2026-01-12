// External Modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");

// Internal Modules
const mainRouter = require("./routes/router");
const { testAllConnections } = require("./utils/connection/connections");
const initSocket = require("./socket"); // 👈 NEW

// App Initialization
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

// CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// DB test
testAllConnections();

// Routes
app.use("/api", mainRouter);

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 INIT SOCKET.IO
initSocket(server);

// 🔥 START SERVER
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
