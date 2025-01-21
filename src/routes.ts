import { Router } from "express";
import adminRouter from "./admin/admin.route";
import renterRouter from "./renters/renter.route";
import { refreshToken } from "./common/middlewar/token.regenreate";
const route = Router();

/**
 * @route /api/refresh
 * @desc Route to refresh access token
 * @access Public
 */
route.get("/refresh", refreshToken);
/**
 * @route /api/admins/*
 * @desc Routes for admin operations
 * @access Private
 */
route.use("/admins", adminRouter);

/**
 * @route /api/renter/*
 * @desc Routes for renter operations
 * @access Private
 */
route.use("/renter", renterRouter);

export default route;
