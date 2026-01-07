const { 
    commuterQuery, getRouteSummaries, getStationSummaries, getBusesForCommuter 
} = require("../database/queries/commuter.query");
const { fetchTripsByRoute, fetchBusesByRoute } = require("../services/commuter.service");

const getStations = async (req, res) => {
  res.json({ status: "success", data: await commuterQuery.getActiveStations() });
};

const getStationStops = async (req, res) => {
  res.json({
    status: "success",
    data: await commuterQuery.getStopsByStation(req.params.id),
  });
};

const getRoutes = async (req, res) => {
  res.json({ status: "success", data: await commuterQuery.getActiveRoutes() });
};

const getRouteStops = async (req, res) => {
  res.json({
    status: "success",
    data: await commuterQuery.getRouteStops(req.params.id),
  });
};

const getActiveTrips = async (req, res) => {
  res.json({
    status: "success",
    data: await commuterQuery.getActiveTrips(),
  });
};


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
};
