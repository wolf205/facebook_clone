import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { reponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../exceptions/AppError.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  req.user = {
    id: decoded.id,
    role: decoded.role,
  };
  next();
});
