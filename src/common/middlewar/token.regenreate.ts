import { Request, Response } from "express";
import { createAccessToken, createRefreshToken } from "../helper/token.helper";
import Renter from "../../renters/renter.schema"; // Assuming you have a User model
import jwt from "jsonwebtoken";
import Admin from "../../admin/admin.schema";
interface JwtPayload {
  _id: string;
  email: string;
  role: string;
}

/**
 * Verifies the refresh token and returns a new access token if valid.
 *
 * If no refresh token is provided, it returns a 401 Unauthorized status.
 * If the refresh token is invalid, it returns a 403 Forbidden status.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<any>} A promise that resolves with the new access token
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  // const { refresh_token } = req.cookies;
  const refresh_token = req.header("Authorization")?.replace("Bearer ", "");

  if (!refresh_token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECURITY_REFRESH as string
    ) as JwtPayload;
    let user;
    if (decoded.role == "USER") {
      user = await Renter.findById(decoded._id);
    } else {
      user = await Admin.findById(decoded._id);
    }
    console.log(user);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const newAccessToken = createAccessToken(user);

    const newRefreshToken = createRefreshToken(user);

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
