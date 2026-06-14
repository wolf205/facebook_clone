import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import express from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { notificationController } from "./notification.controller.js";
import {
  markReadNotification,
  getNotification,
} from "./notification.validator.js";

const router = express.Router();

router.get(
  "/",
  validateMiddleware(getNotification),
  asyncHandler(notificationController.getNotifications),
);

router.patch(
  "/:id",
  validateMiddleware(markReadNotification),
  asyncHandler(notificationController.markReadNotification),
);

router.patch(
  "/",
  validateMiddleware(markReadNotification),
  asyncHandler(notificationController.markReadNotification),
);

export default router;
