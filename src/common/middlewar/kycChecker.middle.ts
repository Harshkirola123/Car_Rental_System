import { Request, Response, NextFunction } from "express";
import Renter from "../../renters/renter.schema";
import Admin from "../../admin/admin.schema";

/**
 * Middleware to check if the user has completed KYC or not.
 *
 * This middleware is used to check if the user has completed KYC before
 * allowing them to perform certain actions.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware or route handler
 *
 * @throws {Response} If the user is not found, it will return a 404 response.
 * @throws {Response} If the user has not completed KYC, it will return a 403 response.
 * @throws {Response} If there is an error, it will return a 500 response.
 */
export const checkKYC = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;
  const userRole = req.user?.role;

  try {
    let user;

    if (userRole === "USER") {
      user = await Renter.findById(userId);
    } else if (userRole === "ADMIN") {
      user = await Admin.findById(userId);
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.kycCompleted) {
      res.status(403).json({
        message:
          "KYC is not completed. Please complete KYC to proceed with this action.",
      });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error checking KYC:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
