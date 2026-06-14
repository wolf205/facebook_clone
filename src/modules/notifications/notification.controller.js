import { notificationService } from "./notification.service.js";
import { response } from "../../shared\/utils/reponse.js";

export const notificationController = {
  markReadNotification: async (req, res) => {
    const userId = req.user?.id;
    const notificationId = req.params?.id;

    await notificationService.markReadNotification({ userId, notificationId });

    return response(res, {
      message: "Đánh dấu đã đọc thành công",
      statusCode: 200,
    });
  },

  getNotifications: async (req, res) => {
    const userId = req.user?.id;
    const { page, limit } = req.query;

    const result = await notificationService.getNotifications({ userId });

    return response(res, {
      message: "Danh sách notification",
      statusCode: 200,
      data: result,
    });
  },
};
