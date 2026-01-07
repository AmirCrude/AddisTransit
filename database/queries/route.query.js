const db = require("../../configs/database.config");

// ROUTES
const insertRoute = async (data) => {
  const [res] = await db.query("INSERT INTO bus_routes SET ?", data);
  return res.insertId;
};

const getAllRoutes = async () => {
  const [rows] = await db.query("SELECT * FROM bus_routes");
  return rows;
};

const getRouteById = async (routeId) => {
  const [rows] = await db.query(
    "SELECT * FROM bus_routes WHERE route_id = ?",
    [routeId]
  );
  return rows[0];
};

const getRouteByName = async (name) => {
  const [rows] = await db.query(
    "SELECT * FROM bus_routes WHERE name = ?",
    [name]
  );
  return rows[0];
};

const updateRouteById = async (routeId, data) => {
  await db.query("UPDATE bus_routes SET ? WHERE route_id = ?", [
    data,
    routeId,
  ]);
};

const updateRouteStatus = async (routeId, isActive) => {
  await db.query(
    "UPDATE bus_routes SET is_active = ? WHERE route_id = ?",
    [isActive, routeId]
  );
};

// ROUTE STOPS
const insertRouteStop = async (data) => {
  await db.query("INSERT INTO route_stops SET ?", data);
};

const getRouteStops = async (routeId) => {
  const [rows] = await db.query(
    `SELECT rs.stop_order, bs.*
     FROM route_stops rs
     JOIN bus_stops bs ON rs.stop_id = bs.stop_id
     WHERE rs.route_id = ?
     ORDER BY rs.stop_order`,
    [routeId]
  );
  return rows;
};

const deleteRouteStops = async (routeId) => {
    await db.query(
      "DELETE FROM route_stops WHERE route_id = ?",
      [routeId]
    );
  };
  

module.exports = {
  insertRoute,
  getAllRoutes,
  getRouteByName,
  getRouteById,
  updateRouteById,
  updateRouteStatus,
  insertRouteStop,
  getRouteStops,
  deleteRouteStops,
};
