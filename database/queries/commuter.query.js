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

  const getStationSummaries = async () => {
    const [rows] = await db.query(`
      SELECT
        s.station_id,
        s.name AS station_name,
  
        -- arriving buses count
        (
          SELECT COUNT(DISTINCT t.trip_id)
          FROM trips t
          JOIN route_stops rs ON rs.route_id = t.route_id
          JOIN bus_stops bs ON bs.stop_id = rs.stop_id
          WHERE t.status = 'in_progress'
            AND rs.stop_order = (
              SELECT MIN(rs2.stop_order) + 1
              FROM route_stops rs2
              WHERE rs2.route_id = t.route_id
            )
            AND bs.station_id = s.station_id
        ) AS arriving_buses,
  
        -- leaving buses count
        (
          SELECT COUNT(DISTINCT t.trip_id)
          FROM trips t
          JOIN route_stops rs ON rs.route_id = t.route_id
          JOIN bus_stops bs ON bs.stop_id = rs.stop_id
          WHERE t.status = 'in_progress'
            AND rs.stop_order = (
              SELECT MIN(rs2.stop_order)
              FROM route_stops rs2
              WHERE rs2.route_id = t.route_id
            )
            AND bs.station_id = s.station_id
        ) AS leaving_buses
  
      FROM stations s
      WHERE s.is_active = TRUE
      ORDER BY s.name;
    `);
  
    return rows;
  };

  const getBusesForCommuter = async () => {
    const [rows] = await db.query(`
      SELECT
        b.bus_id,
        b.plate_number,
        b.is_active,
  
        -- active trip id
        (
          SELECT t.trip_id
          FROM trips t
          WHERE t.bus_id = b.bus_id
            AND t.status = 'in_progress'
          LIMIT 1
        ) AS trip_id,
  
        -- active route name
        (
          SELECT r.name
          FROM trips t
          JOIN bus_routes r ON r.route_id = t.route_id
          WHERE t.bus_id = b.bus_id
            AND t.status = 'in_progress'
          LIMIT 1
        ) AS route_name
  
      FROM buses b
      WHERE b.is_active = TRUE
      ORDER BY b.plate_number;
    `);
  
    return rows.map((bus) => ({
      bus_id: bus.bus_id,
      plate_number: bus.plate_number,
      status: bus.is_active ? "active" : "inactive",
      has_active_trip: !!bus.trip_id,
      trip_id: bus.trip_id,
      route_name: bus.route_name,
    }));
  };

  const getTripsByRoute = async (routeId) => {
    const [rows] = await db.query(
      `
      SELECT
        t.trip_id,
        t.status,
        t.start_time,
  
        b.plate_number AS bus_plate,
  
        origin_station.name AS origin,
        destination_station.name AS destination
  
      FROM trips t
      JOIN buses b ON t.bus_id = b.bus_id
      JOIN bus_routes r ON t.route_id = r.route_id
  
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
  
      WHERE t.route_id = ?
      ORDER BY t.created_at DESC
      `,
      [routeId]
    );
  
    return rows;
  };

  const getBusesByRoute = async (routeId) => {
    const [rows] = await db.query(
      `
      SELECT
        b.bus_id,
        b.plate_number,
        b.status,
  
        t.trip_id AS active_trip_id
  
      FROM buses b
      JOIN bus_routes br
        ON br.bus_id = b.bus_id
  
      LEFT JOIN trips t
        ON t.bus_id = b.bus_id
       AND t.status IN ('scheduled', 'in_progress')
  
      WHERE br.route_id = ?
      ORDER BY b.plate_number
      `,
      [routeId]
    );
  
    return rows;
  };
  
module.exports = {
    getActiveStations,
    getStopsByStation,
    getActiveRoutes,
    getRouteStops,
    getActiveTrips,
    getRouteSummaries,
    getStationSummaries,
    getBusesForCommuter,
    getTripsByRoute,
    getBusesByRoute,
};
