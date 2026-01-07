const db = require("../../configs/database.config");

// insert activity log
const insertActivityLog = async (data) => {
  await db.query(
    "INSERT INTO activity_logs SET ?",
    data
  );
};

// get all logs
const getAllActivityLogs = async () => {
  const [rows] = await db.query(`
    SELECT 
      al.log_id,
      al.action,
      al.description,
      al.created_at,
      u.first_name,
      u.last_name,
      b.plate_number,
      r.name AS route_name
    FROM activity_logs al
    JOIN users u ON al.agent_id = u.user_id
    JOIN buses b ON al.bus_id = b.bus_id
    JOIN bus_routes r ON al.route_id = r.route_id
    ORDER BY al.created_at DESC
  `);
  return rows;
};

// get logs by agent
const getActivityLogsByAgent = async (agentId) => {
  const [rows] = await db.query(
    "SELECT * FROM activity_logs WHERE agent_id = ? ORDER BY created_at DESC",
    [agentId]
  );
  return rows;
};

module.exports = {
  insertActivityLog,
  getAllActivityLogs,
  getActivityLogsByAgent,
};
