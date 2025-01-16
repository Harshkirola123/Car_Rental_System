import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "./admin.schema";
import asyncHandler from "express-async-handler";

// Admin Signup
export const signupAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, role } = req.body;

    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        res.status(400).json({ message: "Admin already exists" });
        return;
      }

      const admin = await Admin.create({
        name,
        email,
        password,
        role: role || "ADMIN",
        active: true,
      });
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECURITY as string,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message:
          "Admin created successfully. Please complete you kyc to use other functionality.",
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

// Admin Login
export const loginAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      if (admin.password !== password) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          kycStatus: admin.kycCompleted,
        },
        process.env.JWT_SECURITY as string,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          kycStatus: admin.kycCompleted,
        },
      });
      next();
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
