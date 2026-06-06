import { authRepository } from "./auth.repository.js";
import { AppError } from "../../shared/exceptions/AppError.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../shared/config/jwt.js";

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

  login: async ({ email, password }) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(
        "Email hoặc mật khẩu không đúng",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(
        "Email hoặc mật khẩu không đúng",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    if (!user.isActive) {
      throw new AppError("User account is inactive", 403, "USER_INACTIVE");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await authRepository.createSession({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    if (!session) {
      throw new AppError(
        "Tạo session không thành công",
        500,
        "ERROR_CREATE_SESSION",
      );
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  },

  logout: async ({ refreshToken, isLogoutAll, userId }) => {
    if (isLogoutAll) {
      await authRepository.deleteAllSession(userId);
      return { message: "Đã đăng xuất khỏi tất cả thiết bị" };
    }

    if (!refreshToken) {
      throw new AppError("Refresh token không được để trống", 400);
    }

    await authRepository.deleteSession(refreshToken);

    return { message: "Đăng xuất thành công" };
  },

  refresh: async (token) => {
    const existingToken = await authRepository.findSessionByToken(token);
    if (!existingToken) {
      throw new AppError("Refresh token không được để trống", 400);
    }

    if (existingToken.expiresAt < new Date()) {
      await authRepository.deleteSession(token);
      throw new AppError("Refresh token đã hết hạn", 401, "TOKEN_EXPIRED");
    }

    const user = await authRepository.findUserById(existingToken.userId);

    if (user.isActive !== true) {
      throw new AppError("Tài khoản này đã bị khóa", 403, "ACCOUT_IS_LOCKED");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    await authRepository.deleteSession(token);

    return {
      accessToken,
      refreshToken,
    };
  },

  changePassword: async ({ userId, oldPassword, newPassword }) => {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("Không tìm thấy user", 400);
    }

    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash,
    );
    if (!isOldPasswordValid) {
      throw new AppError("Mật khẩu hiện tại không chính xác", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await authRepository.changePassword({ id: userId, passwordHash });

    return {
      message: "Đổi mật khẩu thành công",
    };
  },
};
