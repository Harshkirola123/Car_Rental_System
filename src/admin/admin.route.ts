import express from "express";
import { signupAdmin, loginAdmin } from "./admin.controller";
import carRoutes from "../car/car.route";
import rentRouter from "../rentalCar/rental.route";
import { completeKYC, uploadKYC } from "../common/helper/kyc.helper";
import { checkKYC } from "../common/middlewar/kycChecker.middle";
import authMiddleware from "../car/car.auth";
import { loginAdminValidator, signupAdminValidator } from "./admin.validator";

const router = express.Router();

// Route for admin signup
/**
 * @description Routes for admin operations
 * @module admin/admin.route
 */
/**
 * @description Route for admin signup
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
router.post("/signup", signupAdminValidator, signupAdmin);
/**
 * @description Route to complete KYC for an admin
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
router.patch("/kycComplete", authMiddleware, uploadKYC, completeKYC);
/**
 * @description Route for admin login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
router.post("/login", loginAdminValidator, loginAdmin);
/**
 * @description Route for car operations
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
router.use("/cars", carRoutes);
/**
 * @description Route for car submit operations
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
router.use("/carSubmit", rentRouter);

export default router;
