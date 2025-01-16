import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Renter from "../../renters/renter.schema";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const UserAuthMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token);
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
