import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Google OAuth Client setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // 1. Google se token verify karo
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 2. Database me check karo user hai ya nahi
    let user = await User.findOne({ email });

    if (!user) {
      // Naya User aaya hai -> Entry banao par Pending (isApproved: false) rakho
      user = await User.create({
        name: name,
        email: email,
        profilePic: picture,
        isApproved: false, // Yahi apna Gatekeeper hai
        role: "user",
      });
    }

    // 3. Apna custom JWT token banao aage ki security ke liye
    const token = jwt.sign(
      { id: user._id, role: user.role, isApproved: user.isApproved },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 4. Frontend ko token aur user data bhej do
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};

// ==========================================
// ADMIN FUNCTIONS (Inki wajah se error tha)
// ==========================================

// Saare users ki list nikalne ke liye (Admin dashboard ke liye)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false }).sort({
      createdAt: -1,
    });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Get Pending Users Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching pending users", error: error.message });
  }
};
// Kisi user ko approve karne ke liye (WhatsApp pe baat hone ke baad)
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params; // User ka ID URL se aayega

    const user = await User.findByIdAndUpdate(
      id,
      { isApproved: true }, // Approve kar diya
      { new: true }, // Updated data return karega
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User approved successfully", user });
  } catch (error) {
    console.error("Approve User Error:", error);
    res
      .status(500)
      .json({ message: "Error approving user", error: error.message });
  }
};
