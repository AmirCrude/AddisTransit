const db = require("../config/db");

// Create station
const insertStation = async (data) => {
  const [result] = await db.query(
    "INSERT INTO stations SET ?",
    data
  );
  return result.insertId;
};

// Get all stations
const getAllStations = async () => {
  const [rows] = await db.query(
    "SELECT * FROM stations ORDER BY created_at DESC"
  );
  return rows;
};

// Get station by ID
const getStationById = async (stationId) => {
  const [rows] = await db.query(
    "SELECT * FROM stations WHERE station_id = ?",
    [stationId]
  );
  return rows[0];
};

// Update station
const updateStationById = async (stationId, data) => {
  await db.query(
    "UPDATE stations SET ? WHERE station_id = ?",
    [data, stationId]
  );
};

// Update station status
const updateStationStatus = async (stationId, isActive) => {
  await db.query(
    "UPDATE stations SET is_active = ? WHERE station_id = ?",
    [isActive, stationId]
  );
};

module.exports = {
  insertStation,
  getAllStations,
  getStationById,
  updateStationById,
  updateStationStatus,
};
