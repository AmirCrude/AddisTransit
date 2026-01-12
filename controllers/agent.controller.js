const tripService = require("../services/trip.service");

// ================= TRIPS =================

// create trip
const createTrip = async (req, res) => {
  try {
    const tripId = await tripService.createTripByAgent(req.user.id);

    res.status(201).json({
      status: "success",
      message: "Trip created",
      data: {
        trip_id: tripId,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// start trip
const startTrip = async (req, res) => {
  try {
    await tripService.startTripByAgent(req.params.id, req.user.id);

    res.status(200).json({
      status: "success",
      message: "Trip started",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// complete trip
const completeTrip = async (req, res) => {
  try {
    await tripService.completeTripByAgent(req.params.id, req.user.id);

    res.status(200).json({
      status: "success",
      message: "Trip completed",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// cancel trip

const cancelTrip = async (req, res) => {
  try {
    await tripService.cancelTripByAgent(req.params.id, req.user.id);

    res.status(200).json({
      status: "success",
      message: "Trip cancelled",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// pause trip

const pauseTrip = async (req, res) => {
  try {
    await tripService.pauseTripByAgent(req.params.id, req.user.id);

    res.status(200).json({
      status: "success",
      message: "Trip paused",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}

// resume trip
const resumeTrip = async (req, res) => {
  try {
    await tripService.resumeTripByAgent(req.params.id, req.user.id);

    res.status(200).json({
      status: "success",
      message: "Trip resumed",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// get active trip
const getActiveTrip = async (req, res) => {
  try {
    const trip = await tripService.getActiveTripByAgent(req.user.id);

    res.status(200).json({
      status: "success",
      data: trip, // can be null
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createTrip,
  startTrip,
  completeTrip,
  getActiveTrip,
  cancelTrip,
  pauseTrip,
  resumeTrip,
};
