const {
    insertBus,
    getAllBuses,
    getBusById,
    updateBusById,
    updateBusStatus,
    assignBusToRoute,
    assignAgentToBus,
  } = require("../database/queries/bus.query");
const { getRouteById } = require("../database/queries/route.query");
const { getUserById } = require("../database/queries/admin.query");
  
  const createBus = async ({ plate_number, capacity }) => {
    if (!plate_number || !capacity) {
      throw new Error("Plate number and capacity are required");
    }
  
    return await insertBus({
      plate_number,
      capacity,
    });
  };
  
  const fetchAllBuses = async () => {
    return await getAllBuses();
  };
  
  const fetchBusById = async (busId) => {
    const bus = await getBusById(busId);
    if (!bus) throw new Error("Bus not found");
    return bus;
  };
  
  const editBus = async (busId, data) => {
    await fetchBusById(busId);
    await updateBusById(busId, data);
  };
  
  const changeBusStatus = async (busId, isActive) => {
    await fetchBusById(busId);
    await updateBusStatus(busId, isActive);
  };


  const assignRouteToBus = async ({ bus_id, route_id }) => {
    if (!bus_id || !route_id) {
      throw new Error("bus_id and route_id are required");
    }
  
    const bus = await getBusById(bus_id);
    if (!bus) throw new Error("Bus not found");
  
    const route = await getRouteById(route_id);
    if (!route) throw new Error("Route not found");
  
    if (!route.is_active) {
      throw new Error("Cannot assign inactive route");
    }
  
    await assignBusToRoute(bus_id, route_id);
  };

  const assignAgentToBusService = async ({ bus_id, agent_id }) => {
    if (!bus_id || !agent_id) {
      throw new Error("bus_id and agent_id are required");
    }
  
    const bus = await getBusById(bus_id);
    if (!bus) throw new Error("Bus not found");
  
    const agent = await getUserById(agent_id);
    if (!agent) throw new Error("User not found");
  
    if (agent.role !== "ticket_agent") {
      throw new Error("User is not a ticket agent");
    }
  
    if (!bus.route_id) {
      throw new Error("Bus must be assigned to a route before assigning an agent");
    }
  
    await assignAgentToBus(bus_id, agent_id);
  };
    
  module.exports = {
    createBus,
    fetchAllBuses,
    fetchBusById,
    editBus,
    changeBusStatus,
    assignRouteToBus,
    assignAgentToBusService,
  };
  