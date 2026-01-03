const express = require("express");
const router = express.Router();

// Controllers
const {
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  registerAgentFromInvite,
} = require("../controllers/auth.controller");

// Validators
const {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require("../middlewares/validators/auth.validate");

// Middlewares
const { authMiddleware } = require("../middlewares/auth/auth.middleware");
const { checkJson } = require("../middlewares/auth/checkJson.middleware");

// ================= AUTH ROUTES =================

// login
router.post("/login", loginValidator, loginUser);

// forgot password
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);

// reset password
router.post("/reset-password", resetPasswordValidator, resetPassword);

// change password
router.post(
  "/change-password",
  changePasswordValidator,
  authMiddleware,
  changePassword
);

// ✅ Agent self-registration via invite (NEW)
router.post(
  "/register/agent",
  checkJson,
  registerAgentFromInvite
);

module.exports = router;
