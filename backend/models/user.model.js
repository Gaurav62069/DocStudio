import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String }, // Google se aayegi
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isApproved: { type: Boolean, default: false }, // Yahi wo gatekeeper hai
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
