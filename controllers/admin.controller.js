const { createAgentInvite } = require("../services/admin.invite.service");
const stationService = require("../services/station.service");

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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// Get single station
const getStation = async (req, res) => {
  try {
    const station = await stationService.fetchStationById(
      req.params.id
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
    await stationService.editStation(req.params.id, req.body);

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
    const { is_active } = req.body;

    await stationService.changeStationStatus(
      req.params.id,
      is_active
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


module.exports = {
  createAgentInvite: createAgentInviteController,
  createStation,
  getAllStations,
  getStation,
  updateStation,
  updateStationStatus,
};