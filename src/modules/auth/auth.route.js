import express from "express";
import { authController } from "./auth.controller.js";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { registerSchema } from "./auth.validator.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/register",
  validateMiddleware(registerSchema),
  asyncHandler(authController.register),
);

export default router;
