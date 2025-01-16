import { Admin } from "../admin/admin.schema"; // Import the Admin schema interface
import { Express, Request } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: Admin; // Add the user field to the Request interface, which will be of type IAdmin
    }
  }
}
