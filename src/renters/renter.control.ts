import { NextFunction, Request, Response } from "express";
import { renterSignupService, renterLoginService } from "./renter.service";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

/**
 * Handles Renter signup
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const renterSignup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await renterSignupService(name, email, hashedPassword);
    res.cookie("refresh_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // Refresh token expiry (e.g., 30 days)
    });
    return res.status(201).json(result.data);
    next();
  }
);

/**
 * Handles Renter login
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const renterLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    const result = await renterLoginService(email, password);
    res.cookie("refresh_token", result.rToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // Refresh token expiry (e.g., 30 days)
    });

    if (result.error) {
      res.status(400).json({ message: result.error });
      return;
    }

    res.status(200).json(result.data);
    next();
  }
);
