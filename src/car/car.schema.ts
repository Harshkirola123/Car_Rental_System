import mongoose, { Schema, Document } from "mongoose";

interface ICar extends Document {
  name: string;
  description: string;
  pricePerDay: number;
  available: boolean;
  admin: mongoose.Types.ObjectId;
  cancellationFee: number;
  minCancelTime: number;
}

const CarSchema = new Schema<ICar>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Link to the admin who manages the car
  },
  cancellationFee: {
    type: Number,
    required: true,
    default: 20, // Default cancellation fee as a percentage (20%)
  },
  minCancelTime: {
    type: Number,
    required: true,
    default: 24, // Default minimum cancellation time (24 hours)
  },
});

const Car = mongoose.model<ICar>("Car", CarSchema);

export default Car;
