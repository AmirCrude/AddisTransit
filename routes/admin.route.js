const express = require("express");
const router = express.Router();

// Controller
const {
  createAgentInvite,
  // createTicketAgent, // deprecated – do not use
} = require("../controllers/admin.controller");

// Validator
const {
  validateCreateTicketAgent,
} = require("../middlewares/validators/admin.validate");

// Authentication & Role
const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { requireAdmin } = require("../middlewares/auth/admin.auth.middleware");
const { checkJson } = require("../middlewares/auth/checkJson.middleware");

// Admin Routes

// invite ticket agent
router.post(
  "/agent-invite",
  authMiddleware,
  requireAdmin,
  checkJson,
  createAgentInvite
);

module.exports = router;
