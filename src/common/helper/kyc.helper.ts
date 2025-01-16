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
