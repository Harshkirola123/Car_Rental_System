import { Request, Response } from "express";
import Rental from "./rental.schema";
import Car from "../car/car.schema";
import Renter from "../renters/renter.schema";
import moment from "moment";

// Rent a car
export const rentCar = async (req: Request, res: Response) => {
  const renterId = req.user?._id;
  const { carId, startDate, endDate } = req.body;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    if (!car.available) {
      res.status(400).json({ message: "Car is not available for rental" });
      return;
    }

    const renter = await Renter.findById(renterId);
    if (!renter) {
      res.status(404).json({ message: "Renter not found" });
      return;
    }

    const rental = await Rental.create({
      user: renterId,
      car: carId,
      startDate,
      endDate,
      status: "pending",
      paymentStatus: "pending",
      rentalHistory: [],
    });

    await Car.updateOne({ _id: carId }, { $set: { available: false } });

    res.status(201).json({
      message: `Car rented successfully. Please process to payment.\n The link is http://localhost:5000/api/renter/rentalCars/payment/process`,
      rental,
    });
  } catch (error) {
    console.error("Error renting car:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRentalHistory = async (req: Request, res: Response) => {
  const renterId = req.user?._id;

  try {
    const rentalHistory = await Rental.find({ user: renterId })
      .populate("car") // Populate the car details
      .populate("rentalHistory"); // Populate previous rentals if needed

    if (rentalHistory.length === 0) {
      res.status(404).json({ message: "No rental history found" });
      return;
    }

    res.status(200).json({
      message: "Rental history fetched successfully",
      rentals: rentalHistory,
    });
  } catch (error) {
    console.error("Error fetching rental history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminReturnCar = async (req: Request, res: Response) => {
  const adminId = req.user?._id;
  const { rentalId, returnDate, paymentAmount } = req.body;

  try {
    const rental = await Rental.findById(rentalId)
      .populate("car")
      .populate("user");
    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
      return;
    }

    const carId = rental.car._id;
    const renter = rental.user;
    const car = await Car.findById(carId);

    if (car?.admin._id.toString() !== adminId?.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to return this car" });
      return;
    }

    const returnMoment = moment(returnDate);
    const startMoment = moment(rental.startDate);
    const daysRented = returnMoment.diff(startMoment, "days") + 1;
    const pricePerDay = car?.pricePerDay || 50;
    const totalAmount = daysRented * pricePerDay;
    if (paymentAmount !== totalAmount) {
      res
        .status(400)
        .json({ message: "Payment amount does not match calculated amount" });
      return;
    }

    rental.status = "completed";
    rental.paymentStatus = "paid";
    rental.rentalHistory.push({
      startDate: rental.startDate,
      endDate: returnDate,
      totalAmount,
      daysRented,
    });

    await rental.updateOne({
      $set: {
        status: "completed",
        paymentStatus: "paid",
        rentalHistory: rental.rentalHistory,
      },
    });

    await Renter.updateOne(
      { _id: renter._id },
      { $push: { rentals: rental._id } }
    );

    await Car.updateOne({ _id: rental.car._id }, { $set: { available: true } });

    // Send success response
    res.status(200).json({
      message: "Car returned successfully. Payment processed.",
      totalAmount,
      rental,
    });
  } catch (error) {
    console.error("Error returning car by admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
