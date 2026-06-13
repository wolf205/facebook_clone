import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import express from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { commentController } from "./comment.controller.js";
import { createSchema, getSchema } from "./comment.validator.js";

const router = express.Router();

router.post(
  "/posts/:id/comments",
  validateMiddleware(createSchema),
  asyncHandler(commentController.createComment),
);

router.get(
  "/posts/:id/comments",
  validateMiddleware(getSchema),
  asyncHandler(commentController.getComments),
);

router.get(
  "/comments/:id/replies", 
  validateMiddleware(getSchema), 
  asyncHandler(commentController.getReplies),
);

export default router;
