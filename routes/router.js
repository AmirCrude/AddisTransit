const express = require("express");

// Import route modules

const authRouter = require("./auth.route");
const adminRouter = require("./admin.route");
const agentRouter = require("./agent.route");
const commuterRouter = require("./commuter.route");
const router = express.Router();

// API routes

router.use("/auth", authRouter);
router.use("/admin" , adminRouter);
router.use("/agent", agentRouter);
router.use("/commuter", commuterRouter);


module.exports = router;
