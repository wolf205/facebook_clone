import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { response } from "../utils/reponse.js";
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

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    // Xử lý riêng cho lỗi hết hạn
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token đã hết hạn", 401, "TOKEN_EXPIRED"));
    }
    // Xử lý cho lỗi token không hợp lệ (sai signature, v.v.)
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Token không hợp lệ", 401, "INVALID_TOKEN"));
    }
    // Các lỗi khác
    return next(new AppError("Xác thực thất bại", 401, "UNAUTHORIZED"));
  }
});
