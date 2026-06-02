import rateLimit from "express-rate-limit";
import { AppError } from "../exceptions/AppError.js";

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    next(
      new AppError(
        "Too many requests, please try again later.",
        429,
        "TOO_MANY_REQUESTS",
      ),
    );
  },
});

export const authRateLimitMiddleware = rateLimit({
  windowMs: 15  * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    next(
      new AppError(
        "Too many login attempts, please try again later.",
        429,
        "TOO_MANY_LOGIN_ATTEMPTS",
      ),
    );
  },
});
