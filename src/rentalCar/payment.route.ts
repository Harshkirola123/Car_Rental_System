import { Router } from "express";
import { processPayment } from "./payment.gateway";
import authMiddleware from "../common/middlewar/auth.middleware";
import { checkKYC } from "../common/middlewar/kycChecker.middle";

const router = Router();

// Route to process payment
router.post("/process", authMiddleware, checkKYC, processPayment);

export default router;
