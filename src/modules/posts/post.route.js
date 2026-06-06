import express from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { postController } from "./post.controller.js";
import {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
} from "./post.validator.js";

const router = express.Router();

router.post(
  "/",
  validateMiddleware(createPostSchema),
  asyncHandler(postController.createPost),
);

router.patch(
  "/:id",
  validateMiddleware(updatePostSchema),
  asyncHandler(postController.updatePost),
);

router.get(
  "/:id",
  validateMiddleware(postIdSchema),
  asyncHandler(postController.getPost),
);

router.delete(
  "/:id",
  validateMiddleware(postIdSchema),
  asyncHandler(postController.deletePost),
);

export default router;
