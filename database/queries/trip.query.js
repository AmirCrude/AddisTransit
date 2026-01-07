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


// get active trips by route
const getActiveTripsByRoute = async (routeId) => {
    const [rows] = await db.query(
      `SELECT * FROM trips 
       WHERE route_id = ? AND status = 'in_progress'`,
      [routeId]
    );
    return rows;
  };

// COMMUTER READ
const getTripsByRouteForCommuter = async (routeId) => {
  const [rows] = await db.query(
    `
    SELECT
      t.trip_id,
      t.status,
      t.start_time,

      b.bus_id,
      b.plate_number,

      origin_station.name AS origin_station,
      destination_station.name AS destination_station
    FROM trips t
    JOIN buses b ON t.bus_id = b.bus_id
    JOIN bus_routes r ON t.route_id = r.route_id

    -- origin
    JOIN route_stops rs_start 
      ON rs_start.route_id = r.route_id
     AND rs_start.stop_order = 1
    JOIN bus_stops bs_start 
      ON rs_start.stop_id = bs_start.stop_id
    JOIN stations origin_station 
      ON bs_start.station_id = origin_station.station_id

    -- destination
    JOIN route_stops rs_end 
      ON rs_end.route_id = r.route_id
     AND rs_end.stop_order = (
        SELECT MAX(stop_order)
        FROM route_stops
        WHERE route_id = r.route_id
     )
    JOIN bus_stops bs_end 
      ON rs_end.stop_id = bs_end.stop_id
    JOIN stations destination_station 
      ON bs_end.station_id = destination_station.station_id

    WHERE t.route_id = ?
      AND t.status = 'in_progress'
    ORDER BY t.start_time ASC
    `,
    [routeId]
  );

  return rows;
};



module.exports = {
    insertTrip,
    getActiveTripByAgent,
    updateTripById,
    getAllTrips,
    getTripById,
    getActiveTripsByRoute,
    getTripsByRouteForCommuter,
};
