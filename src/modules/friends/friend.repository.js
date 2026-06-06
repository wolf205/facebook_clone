import FriendRequest from "./friendRequest.model.js";
import Friendship from "./friendship.model.js";

export const friendRepository = {
  createFriendRequest: async ({ senderId, receiverId }) => {
    return await FriendRequest.create({ senderId, receiverId });
  },

  isExistsRequest: async ({ senderId, receiverId }) => {
    return await FriendRequest.findOne({
      where: { senderId, receiverId },
      attributes: ["id"],
    });
  },
};
