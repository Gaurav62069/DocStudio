import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // Default naya account 'user' hoga
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Naya account sidha pending state me jayega
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
