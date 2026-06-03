import { authRepository } from "./auth.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import bcrypt from "bcrypt";

export const authService = {
  register: async ({ email, password, firstName, lastName }) => {
    // kiểm tra email đã tồn tại hay chưa
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError("Email đã được sử dụng", 409, "EMAIL_ALREADY_EXISTS");
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // lưu user vào database
    const user = await authRepository.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    if (!user) {
      throw new AppError(
        "Tạo người dùng không thành công",
        500,
        "ERROR_CREATE_USER",
      );
    }

    // trả lại data
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  },
};
