import { z } from "zod";

const mediaSchema = z
  .array(
    z.object({
      url: z.string().url("Đường dẫn media không đúng định dạng URL"),
      publicId: z.string().min(1, "Thiếu publicId"),
    }),
  )
  .max(10, "Một bài viết không được vượt quá 10 file media");

export const createPostSchema = {
  body: z.object({
    content: z
      .string({ required_error: "Nội dung bài viết là bắt buộc" })
      .trim()
      .min(1, "Nội dung bài viết không được để trống")
      .max(1000, "Nội dung bài viết không thể vượt quá 1000 ký tự"),

    privacy: z.enum(["public", "private", "friend"], {
      errorMap: () => ({
        message:
          'Quyền riêng tư phải là "public" hoặc "private" hoặc "friend".',
      }),
    }),

    media: mediaSchema.optional().default([]),
  }),
};

export const updatePostSchema = {
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Nội dung bài viết không được để trống")
      .max(1000, "Nội dung bài viết không thể vượt quá 1000 ký tự")
      .optional(),

    privacy: z
      .enum(["public", "private", "friend"], {
        errorMap: () => ({
          message:
            'Quyền riêng tư phải là "public" hoặc "private" hoặc "friend".',
        }),
      })
      .optional(),

    media: mediaSchema.optional(),
  }),
};
export const postIdSchema = {
  params: z.object({
    id: z.string().uuid("Id bài viết không hợp lệ"),
  }),
};
