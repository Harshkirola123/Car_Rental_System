import { Request, Response } from "express";
import { signupAdminService, loginAdminService } from "./admin.service";
import asyncHandler from "express-async-handler";

/**
 * Handles the signup request for an admin user.
 *
 * This function processes the signup request by validating the provided name, email, password, and role.
 * After successful registration, it generates a refresh token for the new admin user. The refresh token
 * is set as a cookie, and the response includes the result data along with the appropriate status code.
 *
 * @async
 * @function signupAdmin
 * @param {Request} req - The Express request object, which contains the request body data (name, email, password, role).
 * @param {Response} res - The Express response object, which will send the response back to the client.
 * @returns {Promise<void>} A Promise that resolves when the response is sent back to the client.
 *
 * @throws {Error} If any error occurs during the signup process or cookie setting.
 *
 * @example
 * // Sample request body:
 * // { name: "Admin Name", email: "admin@example.com", password: "admin123", role: "superadmin" }
 *
 * // Sample response:
 * // {
 * //   "status": 201,
 * //   "data": { ...user data ... }
 * // }
 *
 * @see {@link signupAdminService} for the logic behind signup and token generation.
 */
export const signupAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const result = await signupAdminService(name, email, password, role);

  res.cookie("refresh_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use 'secure' in production (HTTPS)
    maxAge: 30 * 24 * 60 * 60 * 1000, // Refresh token expiry (e.g., 30 days)
  });

  res.status(result.status).json(result.data);
});

/**
 * Handles the login request for an admin user.
 *
 * This function processes the login request by validating the provided email and password,
 * and then generates a refresh token for the admin user. The refresh token is set as a cookie
 * and the response includes the result data along with the appropriate status code.
 *
 * @async
 * @function loginAdmin
 * @param {Request} req - The Express request object, which contains the request data.
 * @param {Response} res - The Express response object, which will send the response back to the client.
 * @returns {Promise<void>} A Promise that resolves when the response is sent back to the client.
 *
 * @throws {Error} If any error occurs during the login process or cookie setting.
 *
 * @example
 * // Sample request body:
 * // { email: "admin@example.com", password: "admin123" }
 *
 * // Sample response:
 * // {
 * //   "status": 200,
 * //   "data": { ...user data ... }
 * // }
 *
 * @see {@link loginAdminService} for the logic behind login validation and token generation.
 */
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginAdminService(email, password);
  res.cookie("refresh_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use 'secure' in production (HTTPS)
    maxAge: 30 * 24 * 60 * 60 * 1000, // Refresh token expiry (e.g., 30 days)
  });

  res.status(result.status).json(result.data);
});
