import { v2 as cloudinary } from "cloudinary";
import "../../shared/config/cloudinary.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import { logger } from "../../shared/utils/logger.js";

export const cloudinaryService = {
  deleteFile: async (publicId) => {
    try {
      if (!publicId) return null;
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      logger.error("Cloudinary delete fail", error);
      throw new AppError("Xoá file thất bại", 500, "DELETE_FAILED");
    }
  },
};
