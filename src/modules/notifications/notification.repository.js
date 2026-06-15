import Notification from "./notification.model.js";
import User from "../users/user.model.js";

export const notificationRepository = {
  createNotification: async (
    { userId, senderId, type, content, referenceType, referenceId },
    options = {},
  ) => {
    return await Notification.create(
      {
        userId,
        senderId,
        type,
        content,
        referenceType,
        referenceId,
      },
      options,
    );
  },

  markReadAllNotification: async (userId) => {
    return await Notification.update(
      { isRead: true },
      {
        where: { userId },
      },
    );
  },

  findById: async ({ userId, notificationId }) => {
    return await Notification.findOne({
      where: { id: notificationId, userId },
    });
  },

  markReadNotification: async (notificationId) => {
    return await Notification.update(
      { isRead: true },
      {
        where: { id: notificationId },
      },
    );
  },

  getNotifications: async ({ userId, page, limit }) => {
    const offset = (page - 1) * limit;
    const {count, rows} = await Notification.findAndCountAll({
      where: { userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit: limit,
      notificatios: rows,
    };
  },
};
