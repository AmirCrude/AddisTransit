const {
    insertRoute,
    getAllRoutes,
    getRouteByName,
    updateRouteById,
    updateRouteStatus,
    insertRouteStop,
    getRouteStops,
    deleteRouteStops,
  } = require("../database/queries/route.query");
  
  const { getStationIdByName } = require("../database/queries/busStop.query");
  
  const createRoute = async ({ name, description }) => {
    const existing = await getRouteByName(name);
    if (existing) throw new Error("Route already exists");
  
    return await insertRoute({ name, description });
  };
  
  const fetchAllRoutes = async () => {
    return await getAllRoutes();
  };
  
  const fetchRouteByName = async (name) => {
    const route = await getRouteByName(name);
    if (!route) throw new Error("Route not found");
    return route;
  };
  
  const editRoute = async (name, data) => {
    const route = await fetchRouteByName(name);
    await updateRouteById(route.route_id, data);
  };
  
  const changeRouteStatus = async (name, isActive) => {
    const route = await fetchRouteByName(name);
    await updateRouteStatus(route.route_id, isActive);
  };
  
  const addStopsToRoute = async (routeName, stops) => {
    const route = await getRouteByName(routeName);
    if (!route) throw new Error("Route not found");
  
    if (!Array.isArray(stops) || stops.length < 2) {
      throw new Error("Route must have at least 2 stops");
    }
  
    // Remove old stops first
    await deleteRouteStops(route.route_id);
  
    // Insert new ordered stops
    for (const stop of stops) {
      await insertRouteStop({
        route_id: route.route_id,
        stop_id: stop.stop_id,
        stop_order: stop.order,
      });
    }
  };
  
  
  const fetchRouteStops = async (routeName) => {
    const route = await fetchRouteByName(routeName);
    return await getRouteStops(route.route_id);
  };
  
  module.exports = {
    createRoute,
    fetchAllRoutes,
    fetchRouteByName,
    editRoute,
    changeRouteStatus,
    addStopsToRoute,
    fetchRouteStops,
  };
  