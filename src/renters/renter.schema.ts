import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../common/dto/user.dto";

export interface IRenter extends IUser {
  rentals: mongoose.Types.ObjectId[]; // Reference to the Rental documents
}

const RenterSchema = new Schema<IRenter>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  kycCompleted: {
    type: Boolean,
    default: false, // Initially false, as KYC is not completed
  },
  kycPhoto: {
    type: String, // URL or path to the KYC photo
    required: false,
  },
  rentals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental", // Reference to the Rental collection
    },
  ],
});

// Create and export the Renter model
const Renter = mongoose.model<IRenter>("Renter", RenterSchema);

export default Renter;
