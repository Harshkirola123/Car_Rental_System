import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../../admin/admin.schema"; // Import the Admin model

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }
  // console.log(token);
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECURITY as string
    ) as JwtPayload;

    Admin.findById(decoded.id)
      .then((admin) => {
        if (!admin) {
          res.status(401).json({ message: "Admin not found" });
          return;
        }

        if (admin.role !== "ADMIN") {
          res.status(403).json({ message: "Access denied. Admins only." });
          return;
        }

        req.user = admin;

        next();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
      });
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
    return;
  }
};

export default adminOnly;
