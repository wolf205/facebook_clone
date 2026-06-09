import { z } from "zod";

const mediaSchema = z
  .array(
    z.object({
      url: z.string().url("Đường dẫn media không đúng định dạng URL"),
      publicId: z.string().min(1, "Thiếu publicId"),
    }),
  )
  .max(10, "Một tin nhắn không được vượt quá 10 file media");

export const postConversationSchema = {
  body: z
    .object({
      type: z
        .enum(["direct", "group"], {
          errorMap: () => ({
            message: 'Cuộc hội thoại phải có type là "direct" hoặc "group".',
          }),
        })
        .optional()
        .default("direct"),

      name: z
        .string()
        .trim()
        .max(100, "Tên nhóm không được vượt quá 100 ký tự")
        .optional(),

      participants: z
        .array(z.string().uuid("Id người tham gia không hợp lệ"), {
          required_error: "Danh sách người tham gia là bắt buộc",
        })
        .min(1, "Cuộc hội thoại phải có ít nhất 1 người tham gia"),
    })
    .refine(
      (data) => {
        if (data.type === "group" && data.participants.length < 2) {
          return false;
        }
        return true;
      },
      {
        message: "Tạo nhóm chat phải cần mời ít nhất 2 thành viên trở lên",
        path: ["participants"],
      },
    ),
};

export const getMessageSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
  }),

  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};

export const sendMessageSchema = {
  body: z.object({
    conversationId: z.string().uuid("Id không hợp lệ"),
    content: z.string().optional(),
    type: z.enum("text", "system", "call").optional().default("text"),
    media: mediaSchema.optional().default([]),
  }),
};
