import { Request, Response } from "express";
import Car from "./car.schema";
import Admin from "../admin/admin.schema";
import asyncHandler from "express-async-handler";

// Create a new car (Admin only)
export const registerCar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, pricePerDay, available } = req.body;
    const adminId = req.user?._id;

    try {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        res.status(400).json({ message: "Admin not found" });
        return;
      }

      const car = await Car.create({
        name,
        description,
        pricePerDay,
        available,
        admin: adminId, // Associate the car with the admin
      });

      await Admin.updateOne(
        { _id: adminId },
        { $push: { manageCar: car._id } } // Push the car's _id into the 'manageCar' array
      );

      res.status(201).json({ message: "Car created successfully", car });
    } catch (error) {
      console.error("Error creating car:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export const getCars = async (req: Request, res: Response) => {
  const adminId = req.user?._id;

  try {
    const cars = await Car.find({ admin: adminId });
    res.status(200).json({ cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCar = asyncHandler(async (req: Request, res: Response) => {
  const { carId } = req.params;
  const { name, description, pricePerDay, available } = req.body;
  const adminId = req.user?._id; // Admin ID from the JWT token
  console.log(adminId);
  try {
    const car = await Car.findOne({ _id: carId });
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    if (car.admin.toString() !== adminId?.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to update this car" });
      return;
    }

    car.name = name ?? car.name;
    car.description = description ?? car.description;
    car.pricePerDay = pricePerDay ?? car.pricePerDay;
    car.available = available ?? car.available;

    await car.save();
    res.status(200).json({ message: "Car updated successfully", car });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const deleteCar = async (req: Request, res: Response) => {
  const { carId } = req.params;
  const adminId = req.user?._id;

  try {
    const car = await Car.findOne({ _id: carId });
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    if (car.admin.toString() !== adminId?.toString()) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this car" });
      return;
    }

    const result = await Car.deleteOne({ _id: carId });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Can we use by the User to see Available car
export const getAvailableCars = async (req: Request, res: Response) => {
  try {
    const availableCars = await Car.find({ available: true }).populate("admin");

    if (availableCars.length === 0) {
      res.status(404).json({ message: "No cars available at the moment" });
      return;
    }

    res.status(200).json({
      message: "Available cars fetched successfully",
      cars: availableCars,
    });
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).json({ message: "Server error" });
  }
};
