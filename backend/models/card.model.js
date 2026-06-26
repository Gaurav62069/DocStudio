import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    rcNumber: {
      type: String,
      required: true,
      unique: true,
    },
    headOfFamily: { type: String, required: true },
    fatherOrHusbandName: { type: String },
    cardType: { type: String }, // PHH, AAY, etc.
    district: { type: String },
    block: { type: String },
    dealerName: { type: String },
    familyMembers: [
      {
        name: String,
        age: String,
        relation: String,
        uid: String, // Masked Aadhaar ya UID
      },
    ],
    // Jis user ne ye card save kiya hai, uska reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Card", cardSchema);
