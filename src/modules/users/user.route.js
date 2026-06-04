import express from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { getUserByIdSchema, updateProfileSchema } from "./user.validator.js";
import { userController } from "./user.controller.js";

const router = express.Router();

router.get("/me", asyncHandler(userController.getMyProfile));

router.get("/:id", asyncHandler(userController.getProfileById));

router.patch("/me", asyncHandler(userController.updateProfile));

export default router;
