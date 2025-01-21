import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Renter from "../../renters/renter.schema";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware to authenticate users using JWT tokens.
 *
 * This middleware extracts the JWT token from the Authorization header,
 * verifies the token, and retrieves the user from the database. If the
 * token is invalid or the user is not found, it returns an appropriate
 * error response.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware or route handler
 */
const UserAuthMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECURITY as string
      ) as JwtPayload;

      const user = await Renter.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }
  }
);

export default UserAuthMiddleware;
