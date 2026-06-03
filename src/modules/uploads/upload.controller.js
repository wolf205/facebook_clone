import { response } from "../../shared/utils/reponse.js";
import { AppError } from "../../shared/exceptions/AppError.js";

export const uploadController = {
  uploadSingle: async (req, res) => {
    if (!req.file) {
      throw new AppError("Vui lòng chọn file để upload", 400);
    }

    return response(res, {
      statusCode: 200,
      message: "Upload file thành công!",
      data: {
        url: req.file.path,
        resourceType: req.file.resource_type,
        publicId: req.file.filename,
      },
    });
  },

  uploadMultiple: async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new AppError("Vui lòng chọn file để upload", 400, "BAD_REQUEST");
    }

    const uploadData = req.files.map((file) => ({
      url: file.path,
      resourceType: file.resource_type,
      publicId: file.filename,
    }));

    return response(res, {
      statusCode: 200,
      message: `Upload ${req.files.length} file thành công!`,
      data: uploadData,
    });
  },
};
