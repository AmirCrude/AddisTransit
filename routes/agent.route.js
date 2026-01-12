const express = require("express");
const router = express.Router();

const {
  createTrip,
  startTrip,
  completeTrip,
  getActiveTrip,
  cancelTrip,
  pauseTrip,
  resumeTrip
} = require("../controllers/agent.controller");

const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { requireAgent } = require("../middlewares/auth/agent.auth.middleware");
const { resume } = require("../configs/database.config");

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

// cancel trip
router.patch(
  "/trips/:id/cancel",
  authMiddleware,
  requireAgent,
  cancelTrip
)

// pause trip
router.patch(
  "/trips/:id/pause",
  authMiddleware,
  requireAgent,
  pauseTrip
)

// resume trip
router.patch(
  "/trips/:id/resume",
  authMiddleware,
  requireAgent,
  resumeTrip
)



module.exports = router;
