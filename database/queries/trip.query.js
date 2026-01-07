const db = require("../../configs/database.config");

// create trip
const insertTrip = async (data) => {
  const [res] = await db.query("INSERT INTO trips SET ?", data);
  return res.insertId;
};

// get trip by id
// const getTripById = async (tripId) => {
//   const [rows] = await db.query(
//     "SELECT * FROM trips WHERE trip_id = ?",
//     [tripId]
//   );
//   return rows[0];
// };

// get agent active trip
const getActiveTripByAgent = async (agentId) => {
  const [rows] = await db.query(
    "SELECT * FROM trips WHERE agent_id = ? AND status = 'in_progress'",
    [agentId]
  );
  return rows[0];
};

// update trip
const updateTripById = async (tripId, data) => {
  await db.query(
    "UPDATE trips SET ? WHERE trip_id = ?",
    [data, tripId]
  );
};

// ADMIN READ
const getAllTrips = async () => {
  const [rows] = await db.query(`
    SELECT 
      t.*,
      r.name AS route_name,
      b.plate_number,
      CONCAT(u.first_name, ' ', u.last_name) AS agent_name
    FROM trips t
    JOIN bus_routes r ON t.route_id = r.route_id
    JOIN buses b ON t.bus_id = b.bus_id
    LEFT JOIN users u ON t.agent_id = u.user_id
    ORDER BY t.created_at DESC
  `);
  return rows;
};

// Get single trip by ID (admin read-only)
const getTripById = async (tripId) => {
  const [rows] = await db.query(
    `
    SELECT
      t.trip_id,
      t.status,
      t.start_time,
      t.end_time,
      t.created_at,

      r.route_id,
      r.name AS route_name,

      b.bus_id,
      b.plate_number,

      u.user_id AS agent_id,
      CONCAT(u.first_name, ' ', u.last_name) AS agent_name
    FROM trips t
    JOIN bus_routes r ON t.route_id = r.route_id
    JOIN buses b ON t.bus_id = b.bus_id
    LEFT JOIN users u ON t.agent_id = u.user_id
    WHERE t.trip_id = ?
    `,
    [tripId]
  );

  return rows[0];
};


module.exports = {
    insertTrip,
    getTripById,
    getActiveTripByAgent,
    updateTripById,
    getAllTrips,
    getTripById,
};


// // get active trips by route
// const getActiveTripsByRoute = async (routeId) => {
//     const [rows] = await db.query(
//       `SELECT * FROM trips 
//        WHERE route_id = ? AND status = 'in_progress'`,
//       [routeId]
//     );
//     return rows;
//   };