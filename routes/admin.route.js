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

  // Bus routes controllers
  createRoute,
  getAllRoutes,
  getRoute,
  updateRoute,
  updateRouteStatus,
  addRouteStops,
  getRouteStops,

  // Buses controllers
  createBus,
  getAllBuses,
  getBus,
  updateBus,
  updateBusStatus,

  // bus assignment controller
  assignBusToRoute,

  // agent assignment controller
  assignAgentToBus,
  
} = require("../controllers/admin.controller");

// Validators
const { validateCreateStation } = require("../middlewares/validators/station.validate");
const { validateCreateBusStop } = require("../middlewares/validators/busStop.validate");
const { validateCreateRoute, validateAddRouteStops } = require("../middlewares/validators/route.validate");
const { validateCreateBus } = require("../middlewares/validators/bus.validate");
const { validateAssignBusToRoute } = require("../middlewares/validators/bus.assign.validate");
const { validateAssignAgentToBus } = require("../middlewares/validators/bus.assignAgent.validate");


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

// ===== BUS ROUTES =====

router.post(
  "/routes",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateCreateRoute,
  createRoute
);

router.get("/routes", authMiddleware, requireAdmin, getAllRoutes);

router.get("/routes/:routeName", authMiddleware, requireAdmin, getRoute);

router.put(
  "/routes/:routeName",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateRoute
);

router.patch(
  "/routes/:routeName/status",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateRouteStatus
);

// ROUTE STOPS
router.post(
  "/routes/:routeName/stops",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateAddRouteStops,
  addRouteStops
);

router.get(
  "/routes/:routeName/stops",
  authMiddleware,
  requireAdmin,
  getRouteStops
);

// ================= BUSES =================

// create bus
router.post(
  "/buses",
  authMiddleware,
  requireAdmin,
  validateCreateBus,
  checkJson,
  createBus
);

// get all buses
router.get(
  "/buses",
  authMiddleware,
  requireAdmin,
  getAllBuses
);

// get single bus
router.get(
  "/buses/:id",
  authMiddleware,
  requireAdmin,
  getBus
);

// update bus
router.put(
  "/buses/:id",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateBus
);

// activate / deactivate bus
router.patch(
  "/buses/:id/status",
  authMiddleware,
  requireAdmin,
  checkJson,
  updateBusStatus
);

// Assign bus to route
router.post(
  "/buses/assign-route",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateAssignBusToRoute,
  assignBusToRoute
);

// Assign agent to bus
router.post(
  "/buses/assign-agent",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateAssignAgentToBus,
  assignAgentToBus
);



module.exports = router;
