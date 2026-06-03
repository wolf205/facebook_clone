import User from "../users/user.model.js";
import Session from "./session.model.js";

export const authRepository = {
  // Tìm user theo email
  findUserByEmail: (email) => {
    return User.findOne({ where: { email } });
  },

  // Tìm user theo id
  findUserById: (id) => {
    return User.findOne({ where: { id } });
  },

  // Tạo user mới
  createUser: ({ email, passwordHash, firstName, lastName }) => {
    return User.create({ email, passwordHash, firstName, lastName });
  },

  // Lưu refresh token vào bảng refresh_tokens
  createSession: ({ userId, token, expiresAt }) => {
    return Session.create({ userId, token, expiresAt });
  },

  // Tìm session theo refresh token
  findSessionByToken: (token) => {
    return Session.findOne({ where: { token } });
  },

  // Xoá refresh token theo token
  deleteSession: (token) => {
    return Session.destroy({ where: { token } });
  },

  // Xoá tất cả refresh token theo userId
  deleteAllSession: (userId) => {
    return Session.destroy({ where: { userId } });
  },
};
