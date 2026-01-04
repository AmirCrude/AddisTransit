const db = require("../../configs/database.config");

// Get station ID by station name
const getStationIdByName = async (stationName) => {
  const [rows] = await db.query(
    "SELECT station_id FROM stations WHERE name = ?",
    [stationName]
  );
  return rows[0];
};

// Check stop by name + station
const getStopByNameAndStation = async (stationId, stopName) => {
  const [rows] = await db.query(
    "SELECT * FROM bus_stops WHERE station_id = ? AND name = ?",
    [stationId, stopName]
  );
  return rows[0];
};

// Insert stop
const insertBusStop = async (data) => {
  const [result] = await db.query(
    "INSERT INTO bus_stops SET ?",
    data
  );
  return result.insertId;
};

// Get all stops by station
const getStopsByStation = async (stationId) => {
  const [rows] = await db.query(
    "SELECT * FROM bus_stops WHERE station_id = ? ORDER BY created_at DESC",
    [stationId]
  );
  return rows;
};

// Update stop
const updateBusStop = async (stopId, data) => {
  await db.query(
    "UPDATE bus_stops SET ? WHERE stop_id = ?",
    [data, stopId]
  );
};

// Update stop status
const updateBusStopStatus = async (stopId, isActive) => {
  await db.query(
    "UPDATE bus_stops SET is_active = ? WHERE stop_id = ?",
    [isActive, stopId]
  );
};

module.exports = {
  getStationIdByName,
  getStopByNameAndStation,
  insertBusStop,
  getStopsByStation,
  updateBusStop,
  updateBusStopStatus,
};
