import mongoose, { Schema, Document } from "mongoose";

interface IRental extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user (Renter)
  car: mongoose.Types.ObjectId; // Reference to the car (Car)
  startDate: Date;
  endDate: Date;
  status: string; // Rental status (e.g., 'pending', 'active', 'completed', 'cancelled')
  paymentStatus: string; // Payment status ('paid', 'pending')
  rentalHistory: {
    startDate: Date;
    endDate: Date;
    totalAmount: number;
    daysRented: number;
  }[]; // Rental history
}

const RentalSchema = new Schema<IRental>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Renter", // Reference to Renter model
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car", // Reference to Car model
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["paid", "pending"],
    default: "pending",
  },
  rentalHistory: [
    {
      startDate: { type: Date },
      endDate: { type: Date },
      totalAmount: { type: Number },
      daysRented: { type: Number },
      status: { type: String },
    },
  ],
});

const Rental = mongoose.model<IRental>("Rental", RentalSchema);

export default Rental;
