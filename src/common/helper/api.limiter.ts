import rateLimit from "express-rate-limit";

// Create a rate limiter
/**
 * Rate limiter middleware to limit the number of requests from a single IP address.
 *
 * @type {import("express-rate-limit").RateLimitRequestHandler}
 * @constant
 * @default
 */
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});
