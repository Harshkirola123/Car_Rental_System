import { Router } from "express";
import { rentCar, getRentalHistory, adminReturnCar } from "./rental.controll";
import UserAuthMiddleware from "../common/middlewar/auth.middleware";
import adminOnly from "../common/middlewar/adminOnly.middle";
import paymentRouter from "./payment.route";
import { checkKYC } from "../common/middlewar/kycChecker.middle";
const router = Router();

/**
 * @route POST /rent
 * @group Rental - Operations related to renting a car
 * @param {string} body.userId.required - The ID of the user renting the car
 * @param {string} body.carId.required - The ID of the car to be rented
 * @param {string} body.startDate.required - The start date of the rental
 * @param {string} body.endDate.required - The end date of the rental
 * @returns {object} 201 - Car rented successfully with payment instructions
 * @returns {Error} 400 - If car is unavailable or rental data is invalid
 * @returns {Error} 404 - If car or user is not found
 * @throws {Error} 500 - Server error
 * @security JWT - Bearer token for user authentication
 */
router.post("/", UserAuthMiddleware, checkKYC, rentCar);

/**
 * @route GET /rent/history
 * @group Rental - Operations related to viewing rental history
 * @param {string} body.userId.required - The ID of the user
 * @returns {object} 200 - List of rentals with their status and details
 * @returns {Error} 404 - If no rental history is found
 * @throws {Error} 500 - Server error
 * @security JWT - Bearer token for user authentication
 */
router.get("/history", UserAuthMiddleware, checkKYC, getRentalHistory);

/**
 * @route PATCH /rent/submit
 * @group Rental - Operations related to returning a car by admin
 * @param {string} body.adminId.required - The ID of the admin returning the car
 * @param {string} body.rentalId.required - The ID of the rental to be completed
 * @param {Date} body.returnDate.required - The date when the car is returned
 * @param {number} body.paymentAmount.required - The amount paid for the rental
 * @returns {object} 200 - Car returned successfully and payment processed
 * @returns {Error} 400 - If payment amount does not match the calculated total
 * @returns {Error} 403 - If the admin is not authorized to return this car
 * @returns {Error} 404 - If rental or car is not found
 * @throws {Error} 500 - Server error
 * @security JWT - Bearer token for admin authentication
 * @security KYC - KYC verification for admin user
 */
router.patch("/submit", adminOnly, checkKYC, adminReturnCar);

/**
 * @route /payment
 * @group Payment - Operations related to processing payments
 * @see {@link paymentRouter} for specific payment routes
 */
router.use("/payment", paymentRouter);

export default router;
