const express = require("express");
const router = express.Router();

const { 
    getStations,
    getStationStops,
    getRoutes,
    getRouteStops,
    getActiveTrips,
    getStationSummariesController,
    getRouteSummariesController,
    getBuses,
    getTripsByRoute,
    getBusesByRoute,
    getTripDetails,
    getTripMap,
} = require("../controllers/commuter.controller");

router.get("/stations", getStations);
router.get("/stations/:id/stops", getStationStops);

router.get("/routes", getRoutes);
router.get("/routes/:id/stops", getRouteStops);

router.get("/trips/active", getActiveTrips);

router.get("/routes/summary", getRouteSummariesController);

router.get("/stations/summary", getStationSummariesController);

router.get("/buses", getBuses);

router.get("/routes/:routeId/trips", getTripsByRoute );

router.get("/routes/:routeId/buses", getBusesByRoute);

router.get("/trips/:tripId", getTripDetails);

router.get("/trips/:tripId/map", getTripMap);

module.exports = router;
