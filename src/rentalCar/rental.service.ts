import Rental from "./rental.schema";
import Car from "../car/car.schema";
import Renter from "../renters/renter.schema";
import moment from "moment";

/**
 * Rent a car service.
 *
 * This function handles the rental process for a car. It checks if the car is available, validates the renter,
 * creates a rental entry, and updates the car's availability.
 *
 * @async
 * @function rentCarService
 * @param {string | undefined} renterId - The ID of the renter.
 * @param {string} carId - The ID of the car being rented.
 * @param {string} startDate - The rental start date in string format (e.g., "2025-01-01").
 * @param {string} endDate - The rental end date in string format (e.g., "2025-01-07").
 * @returns {Promise<object>} The result object containing the status code and the appropriate message or rental details.
 * @throws {Error} If an error occurs during the rental process.
 */
export const rentCarService = async (
  renterId: string | undefined,
  carId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const car = await Car.findById(carId);
    if (!car) {
      return { status: 404, data: { message: "Car not found" } };
    }
    if (!car.available) {
      return {
        status: 400,
        data: { message: "Car is not available for rental" },
      };
    }

    const renter = await Renter.findById(renterId);
    if (!renter) {
      return { status: 404, data: { message: "Renter not found" } };
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

    return {
      status: 201,
      data: {
        message: `Car rented successfully. Please proceed to payment.`,
        rental,
      },
    };
  } catch (error) {
    console.error("Error renting car:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};
/**
 * Get rental history service.
 *
 * This function retrieves the rental history of a renter by their ID, including the cars rented and the status of each rental.
 *
 * @async
 * @function getRentalHistoryService
 * @param {string | undefined} renterId - The ID of the renter.
 * @returns {Promise<object>} The result object containing the rental history, or an error message if no history is found.
 * @throws {Error} If an error occurs while fetching the rental history.
 */
export const getRentalHistoryService = async (renterId: string | undefined) => {
  try {
    const rentalHistory = await Rental.find({ user: renterId })
      .populate("car")
      .populate("rentalHistory");

    if (rentalHistory.length === 0) {
      return { status: 404, data: { message: "No rental history found" } };
    }

    return {
      status: 200,
      data: {
        message: "Rental history fetched successfully",
        rentals: rentalHistory,
      },
    };
  } catch (error) {
    console.error("Error fetching rental history:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};

/**
 * Admin return car service.
 *
 * This function allows an admin to mark a car as returned, calculate the total payment amount based on rental duration,
 * and update the rental status and car availability.
 *
 * @async
 * @function adminReturnCarService
 * @param {string | undefined} adminId - The ID of the admin returning the car.
 * @param {string} rentalId - The ID of the rental being completed.
 * @param {Date} returnDate - The date the car is returned.
 * @param {number} paymentAmount - The payment amount provided by the renter.
 * @returns {Promise<object>} The result object containing the status code, total amount, and the updated rental details.
 * @throws {Error} If an error occurs during the return process, such as unauthorized access or mismatched payment amount.
 */
export const adminReturnCarService = async (
  adminId: string | undefined,
  rentalId: string,
  returnDate: Date,
  paymentAmount: number
) => {
  try {
    const rental = await Rental.findById(rentalId)
      .populate("car")
      .populate("user");
    if (!rental) {
      return { status: 404, data: { message: "Rental not found" } };
    }

    const car = await Car.findById(rental.car._id);

    if (car?.admin._id.toString() !== adminId?.toString()) {
      return {
        status: 403,
        data: { message: "You are not authorized to return this car" },
      };
    }

    const returnMoment = moment(returnDate);
    const startMoment = moment(rental.startDate);
    const daysRented = returnMoment.diff(startMoment, "days") + 1;
    const pricePerDay = car?.pricePerDay || 50;
    const totalAmount = daysRented * pricePerDay;

    if (paymentAmount !== totalAmount) {
      return {
        status: 400,
        data: { message: "Payment amount does not match calculated amount" },
      };
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
      { _id: rental.user._id },
      { $push: { rentals: rental._id } }
    );
    await Car.updateOne({ _id: rental.car._id }, { $set: { available: true } });

    return {
      status: 200,
      data: {
        message: "Car returned successfully. Payment processed.",
        totalAmount,
        rental,
      },
    };
  } catch (error) {
    console.error("Error returning car by admin:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};
