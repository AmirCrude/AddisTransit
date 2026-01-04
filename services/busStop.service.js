const {
    getStationIdByName,
    getStopByNameAndStation,
    insertBusStop,
    getStopsByStation,
    updateBusStop,
    updateBusStopStatus,
  } = require("../database/queries/busStop.query");
  
  const createBusStop = async (stationName, data) => {
    const station = await getStationIdByName(stationName);
    if (!station) throw new Error("Station not found");
  
    const existing = await getStopByNameAndStation(
      station.station_id,
      data.name
    );
    if (existing) throw new Error("Bus stop already exists at this station");
  
    return await insertBusStop({
      station_id: station.station_id,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  };
  
  const fetchStopsByStation = async (stationName) => {
    const station = await getStationIdByName(stationName);
    if (!station) throw new Error("Station not found");
  
    return await getStopsByStation(station.station_id);
  };
  
  const editBusStop = async (stationName, stopName, data) => {
    const station = await getStationIdByName(stationName);
    if (!station) throw new Error("Station not found");
  
    const stop = await getStopByNameAndStation(
      station.station_id,
      stopName
    );
    if (!stop) throw new Error("Bus stop not found");
  
    await updateBusStop(stop.stop_id, data);
  };
  
  const changeBusStopStatus = async (stationName, stopName, isActive) => {
    const station = await getStationIdByName(stationName);
    if (!station) throw new Error("Station not found");
  
    const stop = await getStopByNameAndStation(
      station.station_id,
      stopName
    );
    if (!stop) throw new Error("Bus stop not found");
  
    await updateBusStopStatus(stop.stop_id, isActive);
  };
  
  module.exports = {
    createBusStop,
    fetchStopsByStation,
    editBusStop,
    changeBusStopStatus,
  };
  