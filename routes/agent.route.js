const express = require("express");
const router = express.Router();

const {
  createTrip,
  startTrip,
  completeTrip,
  getActiveTrip,
} = require("../controllers/agent.controller");

const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { requireAgent } = require("../middlewares/auth/agent.auth.middleware");

// get active trip
router.get(
  "/trips/active",
  authMiddleware,
  requireAgent,
  getActiveTrip
);

// create trip
router.post(
  "/trips",
  authMiddleware,
  requireAgent,
  createTrip
);

// start trip
router.patch(
  "/trips/:id/start",
  authMiddleware,
  requireAgent,
  startTrip
);

// complete trip
router.patch(
  "/trips/:id/complete",
  authMiddleware,
  requireAgent,
  completeTrip
);

module.exports = router;
