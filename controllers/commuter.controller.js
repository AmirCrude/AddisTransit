const {commuterQuery, getRouteSummaries} = require("../database/queries/commuter.query");

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

module.exports = {
    getStations,
    getStationStops,
    getRoutes,
    getRouteStops,
    getActiveTrips,
    getRouteSummariesController,
};
