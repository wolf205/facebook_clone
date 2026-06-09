import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import {
  postConversationSchema,
  getMessageSchema,
  sendMessageSchema,
} from "./chat.validator.js";
import { chatController } from "./chat.controller.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import express from "express";

const router = express.Router();

router.post(
  "/conversation",
  validateMiddleware(postConversationSchema),
  asyncHandler(chatController.createConversation),
);

router.get(
  "/:id/messages",
  validateMiddleware(getMessageSchema),
  asyncHandler(chatController.getMessages),
);

router.post(
  "/messages",
  validateMiddleware(sendMessageSchema),
  asyncHandler(chatController.sendMessage),
);

export default router;
