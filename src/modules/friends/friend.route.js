import express from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { sendFriendRequestSchema } from "./friend.validator.js";
import { friendController } from "./friend.controller.js";

const router = express.Router();

router.post(
  "/request/:id",
  validateMiddleware(sendFriendRequestSchema),
  friendController.sendFriendRequest,
);

export default router;
