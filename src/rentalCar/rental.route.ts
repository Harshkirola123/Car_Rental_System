import { Router } from "express";
import { rentCar, getRentalHistory, adminReturnCar } from "./rental.controll";
import UserAuthMiddleware from "../common/middlewar/auth.middleware";
import adminOnly from "../common/middlewar/adminOnly.middle";
import paymentRouter from "./payment.route";
import { checkKYC } from "../common/middlewar/kycChecker.middle";
const router = Router();

// Route to rent a car (for user Only)
router.post("/", UserAuthMiddleware, checkKYC, rentCar);

// Route to get rental history(for user only)
router.get("/history", UserAuthMiddleware, checkKYC, getRentalHistory);

//Route to return the car (for adminOnly)
router.patch("/submit", adminOnly, checkKYC, adminReturnCar);
router.use("/payment", paymentRouter);

export default router;
