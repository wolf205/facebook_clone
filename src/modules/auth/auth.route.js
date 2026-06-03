import express from "express";
import { authController } from "./auth.controller.js";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  logoutSchema,
  changePasswordSchema,
} from "./auth.validator.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validateMiddleware(registerSchema),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validateMiddleware(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  "/logout",
  authMiddleware,
  validateMiddleware(logoutSchema),
  asyncHandler(authController.logout),
);

router.post("/refresh", asyncHandler(authController.refresh));

router.patch(
  "/password",
  authMiddleware,
  validateMiddleware(changePasswordSchema),
  asyncHandler(authController.changePassword),
);

export default router;
