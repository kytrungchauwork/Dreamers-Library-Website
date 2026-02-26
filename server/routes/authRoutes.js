// routes/authRoutes.js
import express from "express";
import { check } from "express-validator";
import authMiddleware from "../middlewares/auth.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Middleware validate input đơn giản
const validateLogin = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

// Routes
router.post("/signup", authController.signup);
router.post("/register", authController.signup); // Alias cho signup
router.post("/signin", validateLogin, authController.signin);
router.post("/login", validateLogin, authController.signin); // Alias cho signin
router.post("/social-login", authController.socialLogin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);
export default router;
