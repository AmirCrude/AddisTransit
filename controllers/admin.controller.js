const { createAgentInvite } = require("../services/admin.invite.service");
const stationService = require("../services/station.service");
const busStopService = require("../services/busStop.service");

const createAgentInviteController = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.user.id;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const inviteLink = await createAgentInvite(email, adminId);

    res.status(201).json({
      status: "success",
      invite_link: inviteLink,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

// Create station
const createStation = async (req, res) => {
  try {
    const stationId = await stationService.createStation(req.body);

    res.status(201).json({
      status: "success",
      station_id: stationId,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all stations
const getAllStations = async (req, res) => {
  try {
    const stations = await stationService.fetchAllStations();

    res.status(200).json({
      status: "success",
      data: stations,
    });
  } catch {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// Get station by NAME
const getStation = async (req, res) => {
  try {
    const station = await stationService.fetchStationByName(
      decodeURIComponent(req.params.name)
    );

    res.status(200).json({
      status: "success",
      data: station,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update station
const updateStation = async (req, res) => {
  try {
    await stationService.editStationByName(
      decodeURIComponent(req.params.name),
      req.body
    );

    res.status(200).json({
      status: "success",
      message: "Station updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Activate / Deactivate station
const updateStationStatus = async (req, res) => {
  try {
    await stationService.changeStationStatusByName(
      decodeURIComponent(req.params.name),
      req.body.is_active
    );

    res.status(200).json({
      status: "success",
      message: "Station status updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};


// Create bus stop
const createBusStop = async (req, res) => {
  try {
    const stopId = await busStopService.createBusStop(
      decodeURIComponent(req.params.stationName),
      req.body
    );

    res.status(201).json({
      status: "success",
      stop_id: stopId,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

// Get stops by station
const getStopsByStation = async (req, res) => {
  try {
    const stops = await busStopService.fetchStopsByStation(
      decodeURIComponent(req.params.stationName)
    );

    res.status(200).json({
      status: "success",
      data: stops,
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

// Update stop
const updateBusStop = async (req, res) => {
  try {
    await busStopService.editBusStop(
      decodeURIComponent(req.params.stationName),
      decodeURIComponent(req.params.stopName),
      req.body
    );

    res.status(200).json({
      status: "success",
      message: "Bus stop updated",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

// Update stop status
const updateBusStopStatus = async (req, res) => {
  try {
    await busStopService.changeBusStopStatus(
      decodeURIComponent(req.params.stationName),
      decodeURIComponent(req.params.stopName),
      req.body.is_active
    );

    res.status(200).json({
      status: "success",
      message: "Bus stop status updated",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};


module.exports = {
  // agent invites
  createAgentInvite: createAgentInviteController,
  
  // stations
  createStation,
  getAllStations,
  getStation,
  updateStation,
  updateStationStatus,
  
  // bus stops
  createBusStop,
  getStopsByStation,
  updateBusStop,
  updateBusStopStatus,
};