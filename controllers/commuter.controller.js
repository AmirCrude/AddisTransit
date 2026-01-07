const { 
    commuterQuery, getRouteSummaries, getStationSummaries, getBusesForCommuter 
} = require("../database/queries/commuter.query");
const { fetchTripsByRoute, fetchBusesByRoute, fetchTripDetails } = require("../services/commuter.service");

// Commuter Controllers
const getStations = async (req, res) => {
  res.json({ status: "success", data: await commuterQuery.getActiveStations() });
};

// Get stops for a specific station
const getStationStops = async (req, res) => {
  res.json({
    status: "success",
    data: await commuterQuery.getStopsByStation(req.params.id),
  });
};

// Get all active routes
const getRoutes = async (req, res) => {
  res.json({ status: "success", data: await commuterQuery.getActiveRoutes() });
};

// Get stops for a specific route
const getRouteStops = async (req, res) => {
  res.json({
    status: "success",
    data: await commuterQuery.getRouteStops(req.params.id),
  });
};

// Get all active trips
const getActiveTrips = async (req, res) => {
  res.json({
    status: "success",
    data: await commuterQuery.getActiveTrips(),
  });
};

// Get route summaries
const getRouteSummariesController = async (req, res) => {
  try {
    const routes = await getRouteSummaries();

    res.status(200).json({
      status: "success",
      data: routes,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error: " + error.message,
    });
  }
};

// Get station summaries
const getStationSummariesController = async (req, res) => {
    try {
      const stations = await getStationSummaries();
  
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

// Get buses for commuters
  const getBuses = async (req, res) => {
    try {
      const buses = await getBusesForCommuter();
  
      res.status(200).json({
        status: "success",
        data: buses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Server error",
      });
    }
  };

// Get trips by route for commuters
const getTripsByRoute = async (req, res) => {
  try {
    const trips = await fetchTripsByRoute(req.params.routeId);

    res.status(200).json({
      status: "success",
      data: trips,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get buses by route for commuters
const getBusesByRoute = async (req, res) => {
  try {
    const buses = await fetchBusesByRoute(req.params.routeId);

    res.status(200).json({
      status: "success",
      data: buses,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get trip details for commuters
const getTripDetails = async (req, res) => {
  try {
    const trip = await fetchTripDetails(req.params.tripId);

    res.status(200).json({
      status: "success",
      data: trip,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
    getStations,
    getStationStops,
    getRoutes,
    getRouteStops,
    getActiveTrips,
    getRouteSummariesController,
    getStationSummariesController,
    getBuses,
    getTripsByRoute,
    getBusesByRoute,
    getTripDetails,
};
