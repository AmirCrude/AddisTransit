const db = require("../../configs/database.config.js");

// Check station by name
const getStationByName = async (name) => {
  const [rows] = await db.query(
    "SELECT * FROM stations WHERE name = ?",
    [name]
  );
  return rows[0];
};

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

// Update station by name
const updateStationByName = async (name, data) => {
  await db.query(
    "UPDATE stations SET ? WHERE name = ?",
    [data, name]
  );
};

// Update station status
const updateStationStatusByName = async (name, isActive) => {
  await db.query(
    "UPDATE stations SET is_active = ? WHERE name = ?",
    [isActive, name]
  );
};

module.exports = {
  insertStation,
  getAllStations,
  getStationByName,
  updateStationByName,
  updateStationStatusByName,
};
