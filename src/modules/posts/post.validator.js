import { z } from "zod";

export const createPostSchema = z.object({
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

    media: z
      .array(z.string().url("Đường dẫn media không đúng định dạng URL"))
      .max(10, "Một bài viết không được vượt quá 10 file media")
      .optional()
      .default([]),
  }),
});
