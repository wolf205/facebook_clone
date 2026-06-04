import { z } from "zod";

export const getUserByIdSchema = {
  params: z.object({
    id: z.string().uuid("ID người dùng không hợp lệ"),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, "FirstName không được để trống hoặc chỉ chứa dấu cách")
      .optional(),
    lastName: z.string().trim().min(1, "Thiếu lastName").optional(),
    bio: z.string().max(500, "Bio không thể dài quă 500 ký tự").optional(),
    avartaUrl: z.string().url("Định dạng URL không hợp lệ").optional(),
    coverPhotoUrl: z.string().url("Định dạng URL không hợp lệ").optional(),
  }),
};
