import { env } from "../../shared/config/env.js";
import { response } from "../../shared/utils/reponse.js";

import { userService } from "./user.service.js";

export const userController = {
  getMyProfile: async (req, res) => {
    const userId = req.user.id;
    const result = await userService.getMyProfile(userId);

    return response(res, {
      message: "Lấy profile thành công",
      statusCode: 200,
      data: result,
    });
  },

  getProfileById: async (req, res) => {
    const userId = req.params.id;
    const result = await userService.getProfileById(userId);

    return response(res, {
      message: result.message,
      statusCode: 200,
      data: result.user,
    });
  },
};
