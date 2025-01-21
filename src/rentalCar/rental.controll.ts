import { Request, Response } from "express";
import {
  rentCarService,
  getRentalHistoryService,
  adminReturnCarService,
} from "./rental.service";
import asyncHandler from "express-async-handler";

// Rent a car
/**
 * Rent a car
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const rentCar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { carId, startDate, endDate } = req.body;
    const renterId = req.user?._id;

    const result = await rentCarService(renterId, carId, startDate, endDate);

    res.status(result.status).json(result.data);
  }
);

// Get rental history
/**
 * Get rental history
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getRentalHistory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const renterId = req.user?._id;

    const result = await getRentalHistoryService(renterId);

    res.status(result.status).json(result.data);
  }
);

// Admin return car
/**
 * Handle admin car return
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const adminReturnCar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { rentalId, returnDate, paymentAmount } = req.body;
    const adminId = req.user?._id;

    const result = await adminReturnCarService(
      adminId,
      rentalId,
      returnDate,
      paymentAmount
    );

    res.status(result.status).json(result.data);
  }
);
