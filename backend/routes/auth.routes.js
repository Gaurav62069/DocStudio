import express from "express";
import {
  registerUser,
  loginUser,
  getPendingUsers,
  approveUser,
} from "../controllers/auth.controller.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Ye routes protected hain, sirf admin hi access kar sakta hai
router.get("/pending", protect, admin, getPendingUsers);
router.put("/approve/:id", protect, admin, approveUser);

export default router;
