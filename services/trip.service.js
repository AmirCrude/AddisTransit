const {
    insertTrip,
    getTripById,
    getActiveTripByAgent,
    updateTripById,
    getTripByIdInternal,
} = require("../database/queries/trip.query");

const { getBusByAgentId } = require("../database/queries/bus.query");
// const { get } = require("../routes/agent.route");
  
  // AGENT creates trip
  const createTripByAgent = async (agentId) => {
    const activeTrip = await getActiveTripByAgent(agentId);
    if (activeTrip) {
      throw new Error("Agent already has an active trip");
    }
  
    const bus = await getBusByAgentId(agentId, true); // see note below
    if (!bus) throw new Error("No bus assigned to agent");
  
    if (!bus.route_id) {
      throw new Error("Bus has no route assigned");
    }
  
    return await insertTrip({
      route_id: bus.route_id,
      bus_id: bus.bus_id,
      agent_id: agentId,
    });
  };
  
  // start trip
  const startTripByAgent = async (tripId, agentId) => {
    const trip = await getTripByIdInternal(tripId);
    if (!trip) throw new Error("Trip not found");
  
    if (trip.agent_id !== agentId) {
      throw new Error("Unauthorized trip access");
    }
  
    if (trip.status !== "scheduled") {
      throw new Error("Trip cannot be started");
    }
  
    await updateTripById(tripId, {
      status: "in_progress",
      start_time: new Date(),
    });
  };
  
  // complete trip
  const completeTripByAgent = async (tripId, agentId) => {
    const trip = await getTripByIdInternal(tripId);
    if (!trip) throw new Error("Trip not found");
  
    if (trip.agent_id !== agentId) {
      throw new Error("Unauthorized trip access");
    }
  
    if (trip.status !== "in_progress") {
      throw new Error("Trip cannot be completed");
    }
  
    await updateTripById(tripId, {
      status: "completed",
      end_time: new Date(),
    });
  };

  
  const fetchTripByIdForAdmin = async (tripId) => {
    const trip = await getTripById(tripId);
  
    if (!trip) {
      throw new Error("Trip not found");
    }
  
    return trip;
  };
  

module.exports = {
    createTripByAgent,
    startTripByAgent,
    completeTripByAgent,
    getActiveTripByAgent,
    getTripById,
    fetchTripByIdForAdmin,
  };
  