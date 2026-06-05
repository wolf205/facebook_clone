import express from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware.js";
import { postController } from "./post.controller.js";
import { createPostSchema } from "./post.validator.js";

const router = express.Router();

router.post(
  "/",
  validateMiddleware(createPostSchema),
  postController.createPost,
);

export default router;
