const express = require("express");

// Import route modules

const authRouter = require("./auth.route");

const router = express.Router();

// API routes

router.use("/auth", authRouter);

module.exports = router;
