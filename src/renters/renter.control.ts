import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Renter from "./renter.schema";
import asyncHandler from "express-async-handler";

export const renterSignup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password } = req.body;

    try {
      const existingAdmin = await Renter.findOne({ email });
      if (existingAdmin) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const admin = await Renter.create({
        name,
        email,
        password,
        role: "USER",
        active: true,
      });
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECURITY as string,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message: "User created successfully.Please complete your KYC",
        token: token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
      next();
    } catch (error) {
      console.error("Error signing up admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export const renterLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    try {
      // Find the renter by email
      const renter = await Renter.findOne({ email });
      if (!renter) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      if (password != renter.password) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: renter._id, email: renter.email, role: renter.role },
        process.env.JWT_SECURITY as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token });
      next();
    } catch (error) {
      console.error("Error logging in renter:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
