const {
  insertStation,
  getAllStations,
  getStationByName,
  updateStationByName,
  updateStationStatusByName,
} = require("../database/queries/station.query");

const createStation = async ({ name, latitude, longitude, is_major }) => {
  const existing = await getStationByName(name);
  if (existing) {
    throw new Error("Station with this name already exists");
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

const fetchStationByName = async (name) => {
  const station = await getStationByName(name);
  if (!station) throw new Error("Station not found");
  return station;
};

const editStationByName = async (name, data) => {
  await fetchStationByName(name);
  await updateStationByName(name, data);
};

const changeStationStatusByName = async (name, isActive) => {
  await fetchStationByName(name);
  await updateStationStatusByName(name, isActive);
};

module.exports = {
  createStation,
  fetchAllStations,
  fetchStationByName,
  editStationByName,
  changeStationStatusByName,
};
