import { z } from "zod";

export const registerSchema = {
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    firstName: z.string().min(1, "Thiếu firstName"),
    lastName: z.string().min(1, "Thiếu lastName"),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(1, "Thiếu password"),
  }),
};

export const logoutSchema = {
  body: z.object({
    isLogoutAll: z.boolean().optional().default(false),
  }),
};

export const changePasswordSchema = {
  body: z
    .object({
      oldPassword: z.string().min(1, "Thiếu mật khẩu hiện tại"),
      newPassword: z
        .string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa")
        .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường")
        .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 chữ số")
        .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: "Mật khẩu mới không được trùng với mật khẩu cũ",
      path: ["newPassword"], // Gắn lỗi vào đúng trường newPassword
    }),
};
