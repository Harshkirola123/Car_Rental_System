import mongoose, { Schema } from "mongoose";
import { IUser } from "../common/dto/user.dto";

export interface IAdmin extends IUser {
  carsManaged: mongoose.Types.ObjectId[];
}

// Admin Schema
const AdminSchema = new Schema<IAdmin>({
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
    default: "ADMIN",
  },
  kycCompleted: {
    type: Boolean,
    default: false, // Initially false, as KYC is not completed
  },
  kycPhoto: {
    type: String, // URL or path to the KYC photo
    required: false,
  },
  carsManaged: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car", // Reference to the Car model
    },
  ],
});

// Create and export Admin model
const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
