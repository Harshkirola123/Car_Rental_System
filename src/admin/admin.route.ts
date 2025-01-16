import express from "express";
import { signupAdmin, loginAdmin } from "./admin.controller";
import carRoutes from "../car/car.route";
import rentRouter from "../rentalCar/rental.route";
import { completeKYC, uploadKYC } from "../common/helper/kyc.helper";
import { checkKYC } from "../common/middlewar/kycChecker.middle";
import authMiddleware from "../car/car.auth";

const router = express.Router();

// Route for admin signup
router.post("/signup", signupAdmin);
router.put("/kycComplete", authMiddleware, uploadKYC, completeKYC);
// Route for admin login
router.post("/login", loginAdmin);
router.use("/cars", carRoutes);
router.use("/carSubmit", rentRouter);

export default router;
