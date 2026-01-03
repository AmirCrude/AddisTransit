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
} = require("../controllers/admin.controller");

// Authentication & Role
const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { requireAdmin } = require("../middlewares/auth/admin.auth.middleware");
const { checkJson } = require("../middlewares/auth/checkJson.middleware");

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
  createStation
);

// Get all stations
router.get(
  "/stations",
  authMiddleware,
  requireAdmin,
  getAllStations
);

// Get single station
router.get(
  "/stations/:id",
  authMiddleware,
  requireAdmin,
  getStation
);

// Update station
router.put(
  "/stations/:id",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateStation
);

// Activate / deactivate station
router.patch(
  "/stations/:id/status",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateStationStatus
);

module.exports = router;
