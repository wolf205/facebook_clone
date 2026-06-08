import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { postConversationSchema } from "./chat.validator.js";
import { chatController } from "./chat.controller.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import express from "express";

const router = express.Router();

router.post(
  "/conversation",
  validateMiddleware(postConversationSchema),
  asyncHandler(chatController.createConversation),
);

export default router;
