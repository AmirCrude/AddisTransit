const express = require("express");
const router = express.Router();

// Controller
const { createTicketAgent } = require("../controllers/admin.controller");

// Validator
const {
  validateCreateTicketAgent,
} = require("../middlewares/validators/admin.validate");

// Authentication & Role
const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { requireAdmin } = require("../middlewares/auth/admin.auth.middleware");
const { checkJson } = require("../middlewares/auth/checkJson.middleware");

// Admin Routes

// Create ticket agent
router.post(
  "/ticket-agent",
  authMiddleware,
  requireAdmin,
  checkJson,
  validateCreateTicketAgent,
  createTicketAgent
);

module.exports = router;
