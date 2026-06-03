import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

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
