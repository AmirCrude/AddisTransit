const db = require("../../configs/database.config");

// create trip
const insertTrip = async (data) => {
  const [res] = await db.query("INSERT INTO trips SET ?", data);
  return res.insertId;
};

// get agent active trip
const getActiveTripByAgent = async (agentId) => {
  const [rows] = await db.query(
    "SELECT * FROM trips WHERE agent_id = ? AND status IN ('in_progress', 'scheduled') ORDER BY created_at DESC LIMIT 1",
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

      b.bus_id,
      b.plate_number,
      b.capacity,
      b.is_active,

      origin_station.name AS origin,
      destination_station.name AS destination

    FROM trips t
    JOIN buses b ON b.bus_id = t.bus_id
    JOIN bus_routes r ON r.route_id = t.route_id

    JOIN route_stops rs_origin
      ON rs_origin.route_id = r.route_id
     AND rs_origin.stop_order = (
       SELECT MIN(stop_order)
       FROM route_stops
       WHERE route_id = r.route_id
     )

    JOIN bus_stops origin_station
      ON origin_station.stop_id = rs_origin.stop_id

    JOIN route_stops rs_dest
      ON rs_dest.route_id = r.route_id
     AND rs_dest.stop_order = (
       SELECT MAX(stop_order)
       FROM route_stops
       WHERE route_id = r.route_id
     )

    JOIN bus_stops destination_station
      ON destination_station.stop_id = rs_dest.stop_id

    WHERE t.trip_id = ?
    LIMIT 1
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

const getRouteStopsByTrip = async (tripId) => {
  const [rows] = await db.query(
    `
    SELECT
      bs.stop_id,
      bs.name,
      bs.latitude,
      bs.longitude,
      rs.stop_order

    FROM trips t
    JOIN route_stops rs ON rs.route_id = t.route_id
    JOIN bus_stops bs ON bs.stop_id = rs.stop_id

    WHERE t.trip_id = ?
    ORDER BY rs.stop_order ASC
    `,
    [tripId]
  );

  return rows;
};

const getNextStopByTrip = async (tripId) => {
  const [rows] = await db.query(
    `
    SELECT
      bs.stop_id,
      bs.name,
      bs.latitude,
      bs.longitude

    FROM trips t
    JOIN route_stops rs ON rs.route_id = t.route_id
    JOIN bus_stops bs ON bs.stop_id = rs.stop_id

    WHERE t.trip_id = ?
    ORDER BY rs.stop_order ASC
    LIMIT 1
    `,
    [tripId]
  );

  return rows[0] || null;
};

const getRouteStopsForMap = async (tripId) => {
  const [rows] = await db.query(
    `
    SELECT
      bs.stop_id,
      bs.name,
      bs.latitude,
      bs.longitude,
      rs.stop_order

    FROM trips t
    JOIN route_stops rs ON rs.route_id = t.route_id
    JOIN bus_stops bs ON bs.stop_id = rs.stop_id

    WHERE t.trip_id = ?
    ORDER BY rs.stop_order ASC
    `,
    [tripId]
  );

  return rows;
};

const getActiveTrips = async (searchTerm = null) => {
  const params = [];
  let searchClause = "";

  if (searchTerm) {
    searchClause = `
      AND (
        origin_station.name LIKE ?
        OR destination_station.name LIKE ?
      )
    `;
    params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  const [rows] = await db.query(
    `
    SELECT
      t.trip_id,
      t.status,
      t.start_time,

      b.plate_number AS bus_plate,

      r.route_id,

      origin_station.name AS origin,
      destination_station.name AS destination

    FROM trips t
    JOIN buses b ON b.bus_id = t.bus_id
    JOIN bus_routes r ON r.route_id = t.route_id

    JOIN route_stops rs_origin
      ON rs_origin.route_id = r.route_id
     AND rs_origin.stop_order = (
        SELECT MIN(stop_order)
        FROM route_stops
        WHERE route_id = r.route_id
     )

    JOIN bus_stops origin_station
      ON origin_station.stop_id = rs_origin.stop_id

    JOIN route_stops rs_dest
      ON rs_dest.route_id = r.route_id
     AND rs_dest.stop_order = (
        SELECT MAX(stop_order)
        FROM route_stops
        WHERE route_id = r.route_id
     )

    JOIN bus_stops destination_station
      ON destination_station.stop_id = rs_dest.stop_id

    WHERE t.status = 'in_progress'
    ${searchClause}
    ORDER BY t.start_time DESC
    `,
    params
  );

  return rows;
};

// INTERNAL (agent/admin logic)
const getTripByIdInternal = async (tripId) => {
  const [rows] = await db.query(
    `SELECT * FROM trips WHERE trip_id = ? LIMIT 1`,
    [tripId]
  );
  return rows[0];
};




module.exports = {
    insertTrip,
    getActiveTripByAgent,
    updateTripById,
    getAllTrips,
    getTripById,
    getActiveTripsByRoute,
    getTripsByRouteForCommuter,
    getRouteStopsByTrip,
    getNextStopByTrip,
    getRouteStopsForMap,
    getActiveTrips,
    getTripByIdInternal,
};
