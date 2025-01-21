import express from "express";
import {
  registerCar,
  getCars,
  updateCar,
  deleteCar,
  getAvailableCars,
} from "./car.controller";
import { cancelRental } from "./car.cancel";
import authMiddleware from "./car.auth";
import UserAuthMiddleware from "../common/middlewar/auth.middleware";
import { checkKYC } from "../common/middlewar/kycChecker.middle";
import {
  getAvailableCarsValidator,
  registerCarValidator,
  updateCarValidator,
} from "./car.validator";
const router = express.Router();

// Route to create a new car (accessible only by the admin)
router.post(
  "/create",
  authMiddleware,
  checkKYC,
  registerCarValidator,
  registerCar
);

// Route to get all cars managed by the logged-in admin
router.get("/", authMiddleware, checkKYC, getCars);

// Route to update car details (accessible only by the admin who created the car)
router.put("/:carId", authMiddleware, checkKYC, updateCarValidator, updateCar);

// Route to delete a car (accessible only by the admin who created the car)
router.delete("/:carId", authMiddleware, checkKYC, deleteCar);

router.get("/available", getAvailableCarsValidator, getAvailableCars);

router.post("/cancel", UserAuthMiddleware, checkKYC, cancelRental);

export default router;
