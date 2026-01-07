const express = require("express");
const router = express.Router();

const { 
    getStations,
    getStationStops,
    getRoutes,
    getRouteStops,
    getActiveTrips,
    getRouteSummariesController
  } = require("../controllers/commuter.controller");

router.get("/stations", getStations);
router.get("/stations/:id/stops", getStationStops);

router.get("/routes", getRoutes);
router.get("/routes/:id/stops", getRouteStops);

router.get("/trips/active", getActiveTrips);

  
  router.get("/routes/summary", getRouteSummariesController);
  

module.exports = router;
