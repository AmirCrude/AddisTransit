const { getTripsByRoute } = require("../database/queries/commuter.query");

const fetchTripsByRoute = async (routeId) => {
  if (!routeId) throw new Error("Route ID is required");

  return await getTripsByRoute(routeId);
};

module.exports = {
  fetchTripsByRoute,
};
