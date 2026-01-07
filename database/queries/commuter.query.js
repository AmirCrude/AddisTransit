const db = require("../../configs/database.config");

// Stations
const getActiveStations = async () => {
  const [rows] = await db.query(
    "SELECT * FROM stations WHERE is_active = TRUE ORDER BY name"
  );
  return rows;
};

// Stops by station
const getStopsByStation = async (stationId) => {
  const [rows] = await db.query(
    `
    SELECT bs.*
    FROM bus_stops bs
    WHERE bs.station_id = ? AND bs.is_active = TRUE
    ORDER BY bs.name
    `,
    [stationId]
  );
  return rows;
};

// Routes
const getActiveRoutes = async () => {
  const [rows] = await db.query(
    "SELECT * FROM bus_routes WHERE is_active = TRUE ORDER BY name"
  );
  return rows;
};

// Route stops
const getRouteStops = async (routeId) => {
  const [rows] = await db.query(
    `
    SELECT rs.stop_order, bs.*
    FROM route_stops rs
    JOIN bus_stops bs ON rs.stop_id = bs.stop_id
    WHERE rs.route_id = ?
    ORDER BY rs.stop_order
    `,
    [routeId]
  );
  return rows;
};

// Active trips
const getActiveTrips = async () => {
  const [rows] = await db.query(
    `
    SELECT
      t.trip_id,
      t.status,
      t.start_time,

      r.route_id,
      r.name AS route_name,

      b.bus_id,
      b.plate_number
    FROM trips t
    JOIN bus_routes r ON t.route_id = r.route_id
    JOIN buses b ON t.bus_id = b.bus_id
    WHERE t.status = 'in_progress'
    ORDER BY t.start_time DESC
    `
  );
  return rows;
};

// Route summary for commuter
const getRouteSummaries = async () => {
    const [rows] = await db.query(`
      SELECT
        r.route_id,
        r.name AS route_name,
  
        -- origin station
        (
          SELECT s.name
          FROM route_stops rs
          JOIN bus_stops bs ON rs.stop_id = bs.stop_id
          JOIN stations s ON bs.station_id = s.station_id
          WHERE rs.route_id = r.route_id
          ORDER BY rs.stop_order ASC
          LIMIT 1
        ) AS origin,
  
        -- destination station
        (
          SELECT s.name
          FROM route_stops rs
          JOIN bus_stops bs ON rs.stop_id = bs.stop_id
          JOIN stations s ON bs.station_id = s.station_id
          WHERE rs.route_id = r.route_id
          ORDER BY rs.stop_order DESC
          LIMIT 1
        ) AS destination,
  
        -- active trips count
        (
          SELECT COUNT(*)
          FROM trips t
          WHERE t.route_id = r.route_id
            AND t.status = 'in_progress'
        ) AS trip_count,
  
        -- active buses count
        (
          SELECT COUNT(*)
          FROM buses b
          WHERE b.route_id = r.route_id
            AND b.is_active = TRUE
        ) AS bus_count
  
      FROM bus_routes r
      WHERE r.is_active = TRUE
      ORDER BY r.name;
    `);
  
    return rows;
  };
  
  

module.exports = {
  getActiveStations,
  getStopsByStation,
  getActiveRoutes,
  getRouteStops,
  getActiveTrips,
  getRouteSummaries
};
