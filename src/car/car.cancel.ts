import moment from "moment";
import Rental from "../rentalCar/rental.schema";
import { Request, Response } from "express";
import Car from "./car.schema";
import Renter from "../renters/renter.schema";

async function calculateCancellationFee(
  rentalId: string,
  cancellationDate: Date
) {
  const rental = await Rental.findById(rentalId).populate("car");

  if (!rental) {
    throw new Error("Rental not found");
  }

  const carId = rental.car?._id;
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  const startDate = moment(rental.startDate);
  const cancellationMoment = moment(cancellationDate);

  if (!startDate.isValid() || !cancellationMoment.isValid()) {
    throw new Error("Invalid dates provided");
  }

  const timeDiffInHours = cancellationMoment.diff(startDate, "hours");

  if (timeDiffInHours < (car?.minCancelTime || 24)) {
    return 0;
  } else {
    const fee = (car?.cancellationFee / 100) * car?.pricePerDay;
    return fee;
  }
}

export const cancelRental = async (req: Request, res: Response) => {
  const { rentalId, cancellationDate, reason, confirmationMessage } = req.body;
  const renterId = req.user?._id;
  console.log(renterId);

  let rental;
  try {
    rental = await Rental.findById(rentalId).populate("car").populate("user");

    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
      return;
    }
    // console.log(rental.user._id.toString());
    if (rental.user?._id.toString() !== renterId?.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to cancel this rental" });
      return;
    }
  } catch (err) {
    console.error("Error fetching rental:", err);
    res.status(500).json({ message: "Error fetching rental" });
    return;
  }

  let cancellationFee;
  try {
    cancellationFee = await calculateCancellationFee(
      rentalId,
      cancellationDate
    );
  } catch (err) {
    console.error("Error calculating cancellation fee:", err);
    res.status(500).json({ message: "Error calculating cancellation fee" });
    return;
  }

  try {
    await Rental.updateOne(
      { _id: rentalId },
      {
        $set: {
          status: "cancelled",
          paymentStatus: "cancelled",
        },
        $push: {
          rentalHistory: {
            action: "cancelled",
            reason: reason || "No reason provided",
            confirmationMessage:
              confirmationMessage || "No confirmation message provided",
            amount: cancellationFee,
          },
        },
      }
    );
  } catch (err) {
    console.error("Error updating rental:", err);
    res.status(500).json({ message: "Error updating rental status" });
    return;
  }

  try {
    await Renter.updateOne(
      { _id: renterId },
      {
        $push: { rentals: rental._id },
      }
    );
  } catch (err) {
    console.error("Error updating renter's history:", err);
    res.status(500).json({ message: "Error updating renter's history" });
    return;
  }

  try {
    await Car.updateOne({ _id: rental.car }, { $set: { available: true } });
  } catch (err) {
    console.error("Error updating car availability:", err);
    res.status(500).json({ message: "Error updating car availability" });
    return;
  }

  res.status(200).json({
    message: "Rental cancelled successfully",
    cancellationFee,
  });
};
