const {
    insertActivityLog,
    getAllActivityLogs,
    getActivityLogsByAgent,
  } = require("../database/queries/activity.query");
  
  const logActivity = async ({
    agent_id,
    bus_id,
    route_id,
    action,
    description,
  }) => {
    if (!agent_id || !bus_id || !route_id || !action) {
      throw new Error("Missing required activity log fields");
    }
  
    await insertActivityLog({
      agent_id,
      bus_id,
      route_id,
      action,
      description,
    });
  };
  
  const fetchAllLogs = async () => {
    return await getAllActivityLogs();
  };
  
  const fetchLogsByAgent = async (agentId) => {
    return await getActivityLogsByAgent(agentId);
  };
  
  module.exports = {
    logActivity,
    fetchAllLogs,
    fetchLogsByAgent,
  };
  