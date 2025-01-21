import { Request, Response } from "express";
import Renter from "../../renters/renter.schema";
import Admin from "../../admin/admin.schema";
import multer from "multer";
import path from "path";

// Set up multer storage for KYC photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(
      "/Users/75way-mac-58/Harshit/Car_Rental_System/src/common/helper/uploads/kyc"
    );
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const uploadKYC = upload.single("kycPhoto");

/**
 * Completes the KYC process for a user or admin by updating their KYC status and storing the KYC photo.
 *
 * @async
 * @function
 * @param {Request} req - Express request object, containing user details and the uploaded KYC photo.
 * @param {Response} res - Express response object to send status and message.
 *
 * @description
 * This function checks the user's role and updates the KYC status and photo path in the database.
 * If the role is "USER", it updates the Renter collection.
 * If the role is "ADMIN", it updates the Admin collection.
 *
 * @throws Will respond with a 400 error if the KYC photo is not provided or if the role is invalid.
 * Responds with a 500 error if there is a server error during the update process.
 */

export const completeKYC = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const role = req.user?.role;

  if (!req.file) {
    res.status(400).json({ message: "KYC photo is required" });
    return;
  }

  try {
    if (role === "USER") {
      const result = await Renter.updateOne(
        { _id: userId },
        {
          $set: {
            kycCompleted: true,
            kycPhoto: req.file.path,
          },
        }
      );

      res.status(200).json({ message: "KYC completed successfully", result });
    } else if (role === "ADMIN") {
      const result = await Admin.updateOne(
        { _id: userId },
        {
          $set: {
            kycCompleted: true,
            kycPhoto: req.file.path,
          },
        }
      );

      res.status(200).json({ message: "KYC completed successfully", result });
    } else {
      res.status(400).json({ message: "Invalid role provided" });
      return;
    }
  } catch (error) {
    console.error("Error completing KYC:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
