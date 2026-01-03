const {
    insertStation,
    getAllStations,
    getStationById,
    updateStationById,
    updateStationStatus,
  } = require("../database/queries/station.query");
  
  const createStation = async ({
    name,
    latitude,
    longitude,
    is_major,
  }) => {
    if (!name || latitude == null || longitude == null) {
      throw new Error("Name, latitude, and longitude are required");
    }
  
    return await insertStation({
      name,
      latitude,
      longitude,
      is_major: is_major || false,
    });
  };
  
  const fetchAllStations = async () => {
    return await getAllStations();
  };
  
  const fetchStationById = async (stationId) => {
    const station = await getStationById(stationId);
    if (!station) throw new Error("Station not found");
    return station;
  };
  
  const editStation = async (stationId, data) => {
    await fetchStationById(stationId); // existence check
    await updateStationById(stationId, data);
  };
  
  const changeStationStatus = async (stationId, isActive) => {
    await fetchStationById(stationId);
    await updateStationStatus(stationId, isActive);
  };
  
  module.exports = {
    createStation,
    fetchAllStations,
    fetchStationById,
    editStation,
    changeStationStatus,
  };
  