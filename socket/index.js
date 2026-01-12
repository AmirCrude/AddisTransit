const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const agentSocket = require("./agent.socket");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // tighten later
    },
  });

  // 🔐 Auth middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.headers.authorization?.split(" ")[1];
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { userId, role }

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.userId);

    if (socket.user.role === "ticket_agent") {
      agentSocket(socket, io);
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.user.userId);
    });
  });
};
