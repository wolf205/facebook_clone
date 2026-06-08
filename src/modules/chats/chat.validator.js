import { z } from "zod";

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
