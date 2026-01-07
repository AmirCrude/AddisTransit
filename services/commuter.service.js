const { getTripsByRouteForCommuter } = require("../database/queries/trip.query");

const fetchTripsByRoute = async (routeId) => {
  if (!routeId) throw new Error("Route ID is required");

  return await getTripsByRouteForCommuter(routeId);
};

const fetchBusesByRoute = async (routeId) => {
    if (!routeId) throw new Error("Route ID is required");
  
    return await getBusesByRoute(routeId);
  };
  
module.exports = {
    fetchTripsByRoute,
    fetchBusesByRoute,
};
