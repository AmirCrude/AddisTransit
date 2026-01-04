const express = require("express");
const router = express.Router();

// Controllers
const {
  createAgentInvite,

  // Bus stations controllers
  createStation,
  getAllStations,
  getStation,
  updateStation,
  updateStationStatus,

  // Bus stops controllers
  createBusStop,
  getStopsByStation,
  updateBusStop,
  updateBusStopStatus,
} = require("../controllers/admin.controller");

// Validators
const {
  validateCreateStation,
} = require("../middlewares/validators/station.validate");

// Authentication & Role
const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { requireAdmin } = require("../middlewares/auth/admin.auth.middleware");
const { checkJson } = require("../middlewares/auth/checkJson.middleware");

const {
  validateCreateBusStop,
} = require("../middlewares/validators/busStop.validate");


// ================= ADMIN ROUTES =================

// Invite ticket agent
router.post(
  "/agent-invite",
  authMiddleware,
  requireAdmin,
  checkJson,
  createAgentInvite
);

// ================= BUS STATIONS =================

// Create station
router.post(
  "/stations",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateCreateStation,
  createStation
);

// Get all stations
router.get(
  "/stations",
  authMiddleware,
  requireAdmin,
  getAllStations
);

// Get single station BY NAME (semantic)
router.get(
  "/stations/:name",
  authMiddleware,
  requireAdmin,
  getStation
);

// Update station BY NAME
router.put(
  "/stations/:name",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateStation
);

// Activate / deactivate station BY NAME
router.patch(
  "/stations/:name/status",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateStationStatus
);

// ===== BUS STOPS =====

// Create bus stop
router.post(
  "/stations/:stationName/stops",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateCreateBusStop,
  createBusStop
);

// Get stops by station
router.get(
  "/stations/:stationName/stops",
  authMiddleware,
  requireAdmin,
  getStopsByStation
);

// Update bus stop
router.put(
  "/stations/:stationName/stops/:stopName",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateBusStop
);

// Activate / deactivate bus stop
router.patch(
  "/stations/:stationName/stops/:stopName/status",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateBusStopStatus
);


module.exports = router;
