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

module.exports = {
  createAgentInvite: createAgentInviteController,
  createStation,
  getAllStations,
  getStation,
  updateStation,
  updateStationStatus,
};