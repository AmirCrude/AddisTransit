const { getActiveTripByAgent } = require("../database/queries/trip.query");
const db = require("../configs/database.config");

module.exports = async (socket, io) => {
  const agentId = socket.user.userId;

//   console.log("🧑‍✈️ Agent socket connected:", agentId);

  // 1️⃣ Resolve active trip on connect
  const activeTrip = await getActiveTripByAgent(agentId);

  if (!activeTrip) {
    socket.emit("agent:error", {
      message: "No active trip",
    });
    return;
  }

  socket.tripId = activeTrip.trip_id;
  

  socket.emit("agent:trip:active", {
    tripId: activeTrip.id,
    status: activeTrip.status,
  });

  

  // 2️⃣ Location updates
  socket.on("agent:location:update", ({ latitude, longitude }) => {

    console.log(
      `📍 Live location | Trip ${socket.tripId}:`,
      latitude,
      longitude
    );
  
    // 🔁 Broadcast to commuters / web
    io.emit("trip:location:update", {
      tripId: socket.tripId,
      latitude,
      longitude,
    });
  });
  

  // 3️⃣ Trip status updates
  socket.on("agent:trip:status", async ({ status }) => {
    console.log("🔁 Trip status update:" + status);
    await db.query( 
      "UPDATE trips SET status = ? WHERE trip_id = ?",
      [status, socket.tripId]
    );
 
    if (["completed", "cancelled"].includes(status)) {
      socket.disconnect();
    }
  });

  // 4️⃣ Seat availability
  socket.on("agent:seat:update", ({ seat_available }) => {
    console.log(
      `🪑 Live seat availability | Trip ${socket.tripId}:`,
      seat_available
    );
  
    // 🔁 Broadcast to listeners (commuters, admin, etc.)
    io.emit("trip:seat:update", {
      tripId: socket.tripId,
      seat_available,
    });
  });
};
