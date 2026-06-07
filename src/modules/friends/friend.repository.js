import User from "../users/user.model.js";
import FriendRequest from "./friendRequest.model.js";
import Friendship from "./friendship.model.js";
import { Op } from "sequelize";
import sequelize from "../../shared/config/database.js";

export const friendRepository = {
  createFriendRequest: async ({ senderId, receiverId }) => {
    return await FriendRequest.create({ senderId, receiverId });
  },

  isExistsRequest: async ({ senderId, receiverId }) => {
    return await FriendRequest.findOne({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      attributes: ["id"],
    });
  },

  getFriendRequestById: async (requestId) => {
    return await FriendRequest.findByPk(requestId);
  },

  acceptFriendRequest: async ({ requestId }, options = {}) => {
    return await FriendRequest.update(
      { status: "accepted" },
      {
        where: { id: requestId },
        ...options,
      },
    );
  },

  rejectFriendRequest: async (requestId) => {
    return await FriendRequest.update(
      { status: "rejected" },
      { where: { id: requestId } },
    );
  },

  createFriendship: async ({ userId, friendId }, options = {}) => {
    return await Friendship.bulkCreate(
      [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId },
      ],
      options,
    );
  },

  getFriendList: async ({ userId, page, limit, search }) => {
    const offset = (page - 1) * limit;

    const userSearchCondition = search
      ? sequelize.where(
          sequelize.fn(
            "LOWER",
            sequelize.fn(
              "CONCAT",
              sequelize.col("friendInfo.last_name"),
              " ",
              sequelize.col("friendInfo.first_name"),
            ),
          ),
          "LIKE",
          `%${search.toLowerCase()}%`,
        )
      : null;

    const { count, rows } = await Friendship.findAndCountAll({
      where: { userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: "friendInfo",
          attributes: ["id", "firstName", "lastName", "avatarUrl", "fullName"],
          where: userSearchCondition ?? undefined,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      friends: rows,
    };
  },

  isExistsFriendship: async ({ userId, friendId }) => {
    return await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { friendId: userId, userId: friendId },
        ],
      },
    });
  },

  deleteFriendship: async ({ userId, friendId }, options = {}) => {
    return await Friendship.destroy({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
      ...options,
    });
  },

  deleteFriendRequest: async ({ userId, friendId }, options = {}) => {
    return await FriendRequest.destroy({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      ...options,
    });
  },
};
