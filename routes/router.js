const express = require("express");

// Import route modules

const authRouter = require("./auth.route");
const adminRouter = require("./admin.route");
const router = express.Router();

// API routes

router.use("/auth", authRouter);
router.use("/admin" , adminRouter);

module.exports = router;
