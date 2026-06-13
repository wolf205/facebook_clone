import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { likeSchema } from "./like.validator.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { likeController } from "./like.controller.js";
import express from "express";

const router = express.Router();

router.post(
  "/posts/:id/likes",
  validateMiddleware(likeSchema),
  asyncHandler(likeController.postLike),
);

router.post(
  "/message/:id/likes",
  validateMiddleware(likeSchema),
  asyncHandler(likeController.messageLike),
);

export default router;
