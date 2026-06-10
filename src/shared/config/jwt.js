import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { AppError } from "../exceptions/AppError.js";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token đã hết hạn", 401, "TOKEN_EXPIRED");
    }
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Token không hợp lệ", 401, "INVALID_TOKEN");
    }
    throw new AppError("Xác thực thất bại", 401, "UNAUTHORIZED");
  }
};
