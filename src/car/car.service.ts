import Car from "./car.schema";
import Admin from "../admin/admin.schema";

// Register a new car (Admin only)
export const registerCarService = async (
  name: string,
  description: string,
  pricePerDay: number,
  available: boolean,
  adminId: string | undefined
) => {
  try {
    // Check if admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return { status: 400, data: { message: "Admin not found" } };
    }

    // Create the car and associate it with the admin
    const car = await Car.create({
      name,
      description,
      pricePerDay,
      available,
      admin: adminId,
    });

    // Push the car's ID into the 'manageCar' array for the admin
    await Admin.updateOne({ _id: adminId }, { $push: { manageCar: car._id } });

    return {
      status: 201,
      data: { message: "Car created successfully", car },
    };
  } catch (error) {
    console.error("Error creating car:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};

// Get all cars for the admin
export const getCarsService = async (adminId: string) => {
  try {
    const cars = await Car.find({ admin: adminId });
    return {
      status: 200,
      data: { cars },
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};

// Update car details (Admin only)
export const updateCarService = async (
  carId: string,
  name: string,
  description: string,
  pricePerDay: number,
  available: boolean,
  adminId: string
) => {
  try {
    const car = await Car.findOne({ _id: carId });
    if (!car) {
      return { status: 404, data: { message: "Car not found" } };
    }

    if (car.admin.toString() !== adminId?.toString()) {
      return {
        status: 403,
        data: { message: "You are not authorized to update this car" },
      };
    }

    // Update car fields
    car.name = name ?? car.name;
    car.description = description ?? car.description;
    car.pricePerDay = pricePerDay ?? car.pricePerDay;
    car.available = available ?? car.available;

    await car.save();

    return {
      status: 200,
      data: { message: "Car updated successfully", car },
    };
  } catch (error) {
    console.error("Error updating car:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};

// Delete car (Admin only)
export const deleteCarService = async (carId: string, adminId: string) => {
  try {
    const car = await Car.findOne({ _id: carId });
    if (!car) {
      return { status: 404, data: { message: "Car not found" } };
    }

    if (car.admin.toString() !== adminId?.toString()) {
      return {
        status: 403,
        data: { message: "You are not authorized to delete this car" },
      };
    }

    const result = await Car.deleteOne({ _id: carId });

    if (result.deletedCount === 0) {
      return { status: 404, data: { message: "Car not found" } };
    }

    return {
      status: 200,
      data: { message: "Car deleted successfully" },
    };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};

// Get available cars (For all users)
export const getAvailableCarsService = async () => {
  try {
    const availableCars = await Car.find({ available: true }).populate("admin");

    if (availableCars.length === 0) {
      return {
        status: 404,
        data: { message: "No cars available at the moment" },
      };
    }

    return {
      status: 200,
      data: {
        message: "Available cars fetched successfully",
        cars: availableCars,
      },
    };
  } catch (error) {
    console.error("Error fetching available cars:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};
