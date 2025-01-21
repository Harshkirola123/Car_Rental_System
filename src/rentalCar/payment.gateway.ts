import { Request, Response } from "express";
import Rental from "./rental.schema";
import Car from "../car/car.schema";

/**
 * Processes a payment for a rental.
 * @param {Request} req The Express Request object.
 * @param {Response} res The Express Response object.
 * @returns {Promise<void>}
 */
export const processPayment = async (req: Request, res: Response) => {
  const renterId = req.user?._id;
  const { rentalId } = req.body;

  try {
    const rental = await Rental.findById(rentalId).populate("car");
    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
      return;
    }

    if (renterId?.toString() !== rental.user.toString()) {
      res.status(403).json({
        message: "You are not authorized to make the payment for this rental",
      });
      return;
    }

    if (rental.paymentStatus === "paid") {
      res.status(400).json({ message: "Rental has already been paid" });
      return;
    }

    const paymentSuccessful = true;

    if (paymentSuccessful) {
      rental.paymentStatus = "paid";
      rental.status = "active";
      await rental.save();

      await Car.updateOne({ _id: rental.car }, { $set: { available: false } });

      res
        .status(200)
        .json({ message: "Payment successful, car is now rented", rental });
      return;
    } else {
      res.status(400).json({ message: "Payment failed" });
      return;
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
