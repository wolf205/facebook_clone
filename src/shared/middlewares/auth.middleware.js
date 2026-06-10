import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../config/jwt.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const decoded = verifyAccessToken(authHeader);
  req.user = {
    id: decoded.id,
    role: decoded.role,
  };

  next();
});
