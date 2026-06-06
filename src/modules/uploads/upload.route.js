import express from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { uploadController } from "./upload.controller.js";
import { upload } from "../../shared/config/cloudinary.js";

const router = express.Router();

router.post(
  "/file",
  upload.single("file"),
  asyncHandler(uploadController.uploadSingle),
);

router.post(
  "/files",
  upload.array("files", 10),
  asyncHandler(uploadController.uploadMultiple),
);

export default router;
