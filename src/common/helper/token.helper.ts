import jwt from "jsonwebtoken";
import { IUser } from "../dto/user.dto";

// Create Access Token (Short-lived)
export const createAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECURITY_ACCESS as string,
    { expiresIn: "1h" }
  );
};

// Create Refresh Token (Long-lived)
export const createRefreshToken = (user: IUser) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECURITY_REFRESH as string,
    { expiresIn: "30d" }
  );
};
