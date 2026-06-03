import { authService } from "./auth.service.js";
import { response } from "../../shared/utils/reponse.js";
import { env } from "../../shared/config/env.js";

export const authController = {
  register: async (req, res) => {
    const user = await authService.register(req.body);
    return response(res, {
      statusCode: 201,
      message: "Đăng ký thành công!",
      data: user,
    });
  },

  login: async (req, res) => {
    const result = await authService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });

    return response(res, {
      statusCode: 200,
      message: "Đăng nhập thành công!",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  },

  logout: async (req, res) => {
    const userId = req.user.id;
    const refreshToken = req.cookies.refreshToken;
    const isLogoutAll = req.body.isLogoutAll;

    const result = await authService.logout({
      refreshToken,
      isLogoutAll,
      userId,
    });

    return response(res, {
      statusCode: 201,
      message: result.message,
    });
  },
};
