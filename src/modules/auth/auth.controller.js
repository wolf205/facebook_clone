import { authService } from "./auth.service.js";
import { response } from "../../shared/utils/reponse.js";

export const authController = {
  register: async (req, res) => {
    const user = await authService.register(req.body);
    return response(res, {
      statusCode: 201,
      message: "Đăng ký thành công",
      data: user,
    });
  },
};
