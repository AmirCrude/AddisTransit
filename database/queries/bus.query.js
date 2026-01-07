const db = require("../../configs/database.config");

// create bus
const insertBus = async (data) => {
  const [result] = await db.query(
    "INSERT INTO buses SET ?",
    data
  );
  return result.insertId;
};

// get all buses
const getAllBuses = async () => {
    const [rows] = await db.query(`
      SELECT b.*, r.name AS route_name
      FROM buses b
      LEFT JOIN bus_routes r ON b.route_id = r.route_id
      ORDER BY b.created_at DESC
    `);
    return rows;
  };
  

// get bus by id
const getBusById = async (busId) => {
  const [rows] = await db.query(
    "SELECT * FROM buses WHERE bus_id = ?",
    [busId]
  );
  return rows[0];
};

// update bus
const updateBusById = async (busId, data) => {
  await db.query(
    "UPDATE buses SET ? WHERE bus_id = ?",
    [data, busId]
  );
};

// update bus status
const updateBusStatus = async (busId, isActive) => {
  await db.query(
    "UPDATE buses SET is_active = ? WHERE bus_id = ?",
    [isActive, busId]
  );
};

// assign bus to route
const assignBusToRoute = async (busId, routeId) => {
  await db.query(
    "UPDATE buses SET route_id = ? WHERE bus_id = ?",
    [routeId, busId]
  );
};

// assign agent to bus
const assignAgentToBus = async (busId, agentId) => {
  await db.query(
    "UPDATE buses SET assigned_agent_id = ? WHERE bus_id = ?",
    [agentId, busId]
  );
};

// get bus assigned to agent
const getBusByAgentId = async (agentId) => {
  const [rows] = await db.query(
    "SELECT * FROM buses WHERE assigned_agent_id = ?",
    [agentId]
  );
  return rows[0];
};

module.exports = {
  insertBus,
  getAllBuses,
  getBusById,
  updateBusById,
  updateBusStatus,
  assignBusToRoute,
  assignAgentToBus,
  getBusByAgentId,
};
