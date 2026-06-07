import express from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { idSchema, getListFriendSchema } from "./friend.validator.js";
import { friendController } from "./friend.controller.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/request/:id",
  validateMiddleware(idSchema),
  asyncHandler(friendController.sendFriendRequest),
);

router.patch(
  "/accept/:id",
  validateMiddleware(idSchema),
  asyncHandler(friendController.acceptFriendRequest),
);

router.patch(
  "/reject/:id",
  validateMiddleware(idSchema),
  asyncHandler(friendController.rejectFriendRequest),
);

router.get(
  "/",
  validateMiddleware(getListFriendSchema),
  asyncHandler(friendController.getFriendList),
);

export default router;
