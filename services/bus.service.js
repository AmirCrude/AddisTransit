const {
    insertBus,
    getAllBuses,
    getBusById,
    updateBusById,
    updateBusStatus,
  } = require("../database/queries/bus.query");
  
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
  
  module.exports = {
    createBus,
    fetchAllBuses,
    fetchBusById,
    editBus,
    changeBusStatus,
  };
  