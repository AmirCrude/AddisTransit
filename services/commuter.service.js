const { getTripById, getTripsByRouteForCommuter, getRouteStopsByTrip, getNextStopByTrip } = require("../database/queries/trip.query");
const { getBusesByRoute } = require("../database/queries/bus.query");

const fetchTripsByRoute = async (routeId) => {
  if (!routeId) throw new Error("Route ID is required");

  return await getTripsByRouteForCommuter(routeId);
};

const fetchBusesByRoute = async (routeId) => {
    if (!routeId) throw new Error("Route ID is required");
  
    return await getBusesByRoute(routeId);
  };
  
  const fetchTripDetails = async (tripId) => {
    if (!tripId) throw new Error("Trip ID is required");
  
    const trip = await getTripById(tripId);
    if (!trip) throw new Error("Trip not found");
  
    const routeStops = await getRouteStopsByTrip(tripId);
    const nextStop = await getNextStopByTrip(tripId);
  
    return {
      trip_id: trip.trip_id,
      status: trip.status,
      start_time: trip.start_time,
      end_time: trip.end_time,
  
      bus: {
        bus_id: trip.bus_id,
        plate_number: trip.plate_number,
        capacity: trip.capacity,
        is_active: trip.is_active,
      },
  
      origin: trip.origin,
      destination: trip.destination,
  
      next_stop: nextStop,
      route_stops: routeStops,
    };
  };

  const { getRouteStopsForMap } = require("../database/queries/trip.query");

const fetchTripMap = async (tripId) => {
  if (!tripId) throw new Error("Trip ID is required");

  const stops = await getRouteStopsForMap(tripId);
  if (stops.length === 0) throw new Error("Trip not found");

  const path = stops.map((stop) => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  return {
    trip_id: Number(tripId),
    path,
    stops,
  };
};


module.exports = {
  fetchTripsByRoute,
  fetchBusesByRoute,
  fetchTripDetails,
  fetchTripMap,
};
