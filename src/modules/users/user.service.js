import { AppError } from "../../shared/exceptions/AppError.js";
import { userRepository } from "./user.repository.js";

export const userService = {
  getMyProfile: async (userId) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        `Không tìm thấy user có id: ${userId}`,
        400,
        "NOT_FOUND_USER",
      );
    }

    if (!user.isActive) {
      throw new AppError("Tài khoản này đã bị khóa", 403, "USER_INACTIVE");
    }

    return {
      user,
    };
  },

  getProfileById: async (userId) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        `Không tìm thấy user có id: ${userId}`,
        400,
        "NOT_FOUND_USER",
      );
    }

    if (!user.isActive) {
      throw new AppError("Tài khoản này đã bị khóa", 403, "USER_INACTIVE");
    }

    return {
      message: `Lấy profile của user ${user.fullName} thành công`,
      user,
    };
  },

  updateProfile: async ({ id, ...updateData }) => {
    const user = await userRepository.findUserById(id);

    if (!user) {
      throw new AppError(
        `Không tìm thấy user có id: ${id}`,
        400,
        "NOT_FOUND_USER",
      );
    }

    if (!user.isActive) {
      throw new AppError("Tài khoản này đã bị khóa", 403, "USER_INACTIVE");
    }

    const newUser = await userRepository.updateProfile({ id, ...updateData });

    return {
      user: newUser,
    };
  },
};
