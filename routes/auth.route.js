const express = require("express");
const router = express.Router();

// Controller
const {
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");

// Middlewares 
const {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator, 
} = require("../middlewares/validators/auth.validate");

// authentication
const { authMiddleware } = require("../middlewares/auth/auth.middleware");

// Auth Routes

// login route
router.post("/login", loginValidator, loginUser);


// forget password
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

module.exports = router;
