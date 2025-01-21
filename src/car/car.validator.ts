// car.validator.ts
import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Validation rules for registering a new car.
 */
export const registerCarValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Car name is required")
    .isLength({ min: 3 })
    .withMessage("Car name must be at least 3 characters long"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("pricePerDay")
    .isFloat({ gt: 0 })
    .withMessage("Price per day must be a positive number"),

  body("available")
    .isBoolean()
    .withMessage("Available field must be a boolean (true/false)"),

  // Middleware to handle validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

/**
 * Validation rules for updating an existing car.
 */
export const updateCarValidator = [
  param("carId")
    .notEmpty()
    .withMessage("Car ID is required")
    .isMongoId()
    .withMessage("Invalid Car ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Car name must be at least 3 characters long"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("pricePerDay")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price per day must be a positive number"),

  body("available")
    .optional()
    .isBoolean()
    .withMessage("Available field must be a boolean (true/false)"),

  // Middleware to handle validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];

/**
 * Validation rules for getting available cars.
 */
export const getAvailableCarsValidator = [
  // You can add query parameters validation here if needed, for now it's simple fetch
  query("available")
    .optional()
    .isBoolean()
    .withMessage("Available parameter must be a boolean"),

  // Middleware to handle validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
