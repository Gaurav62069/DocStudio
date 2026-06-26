import express from "express";
import {
  googleLogin,
  getPendingUsers,
  approveUser,
  getAllUsers,
} from "../controllers/auth.controller.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ab purana register/login hat gaya, sirf Google Login hai
router.post("/google-login", googleLogin);

// Ye routes protected hain, sirf admin hi access kar sakta hai
router.get("/pending", protect, admin, getPendingUsers);
router.put("/approve/:id", protect, admin, approveUser);
router.get("/users", protect, admin, getAllUsers); // Saare users dekhne ke liye

export default router;
