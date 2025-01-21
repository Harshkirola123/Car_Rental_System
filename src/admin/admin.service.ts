import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "./admin.schema";
import {
  createAccessToken,
  createRefreshToken,
} from "../common/helper/token.helper";

// Admin Signup Service
/**
 * Signup admin service
 *
 * @param {string} name - Admin name
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {string} [role=ADMIN] - Admin role
 * @returns {Promise<object>}
 */
export const signupAdminService = async (
  name: string,
  email: string,
  password: string,
  role: string = "ADMIN"
) => {
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return { status: 400, data: { message: "Admin already exists" } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      active: true,
    });

    const accessToken = createAccessToken(admin);
    const refreshToken = createRefreshToken(admin);
    return {
      status: 201,
      token: refreshToken,
      data: {
        message:
          "Admin created successfully. Please complete your KYC to use other functionality.",
        token: accessToken,
        refreshToken: refreshToken,
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    };
  } catch (error) {
    console.error("Error signing up admin:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};

/**
 * Login admin service
 *
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<object>}
 */
export const loginAdminService = async (email: string, password: string) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return { status: 400, data: { message: "Invalid credentials" } };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { status: 400, data: { message: "Invalid credentials" } };
    }

    const accessToken = createAccessToken(admin);
    const refreshToken = createRefreshToken(admin);

    return {
      status: 200,
      token: refreshToken,
      data: {
        message: "Login successful",
        accessToken,
        refreshToken: refreshToken,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          kycStatus: admin.kycCompleted,
        },
      },
    };
  } catch (error) {
    console.error("Error logging in admin:", error);
    return { status: 500, data: { message: "Server error" } };
  }
};
