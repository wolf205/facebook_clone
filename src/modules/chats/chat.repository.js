import User from "../users/user.model.js";
import Conversation from "./models/conversation.model.js";
import Participant from "./models/participant.model.js";
import Message from "./models/message.model.js";
import messageMedia from "./models/messageMedia.model.js";

export const chatRepository = {
  createConversation: async ({ participantData, type, name }, options = {}) => {
    return await Conversation.create(
      {
        type,
        name,
        participants: participantData,
      },
      {
        include: [
          {
            model: Participant,
            as: "participants",
            include: [
              {
                model: User,
                as: "userInfo",
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "avatarUrl",
                  "fullName",
                ],
              },
            ],
          },
        ],
        ...options,
      },
    );
  },

  isParticipant: async ({ userId, conversationId }) => {
    const participant = await Participant.findOne({
      where: { userId, conversationId },
    });

    return !!participant;
  },

  getMessages: async ({ conversationId, page, limit }) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      where: { conversationId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: messageMedia,
          as: "media",
          attributes: ["id", "mediaUrl", "mediaType", "orderIndex"],
        },
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "avatarUrl", "fullName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
      messages: rows,
    };
  },

  isExistsConversation: async (conversationId) => {
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
    });

    return !!conversation;
  },

  sendMessage: async (
    { userId, conversationId, content, type, formatedMedia },
    options = {},
  ) => {
    return await Message.create(
      {
        conversationId,
        senderId: userId,
        content,
        type,
        media: formatedMedia,
      },
      {
        include: [
          {
            model: messageMedia,
            as: "media",
          },
        ],
        ...options,
      },
    );
  },

  getConversations: async (userId) => {
    return await Participant.findAll({
      where: { userId },
      include: [
        {
          model: Conversation,
          as: "conversation",
          include: [
            {
              model: Message,
              as: "lastMessage",
            },
            {
              model: Participant,
              as: "participants",
              include: [
                {
                  model: User,
                  as: "userInfo",
                  attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "fullName",
                    "avatarUrl",
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [
        [{ model: Conversation, as: "conversation" }, "updatedAt", "DESC"],
      ],
    });
  },

  updateLastMessage: async (
    { conversationId, lastMessageId },
    options = {},
  ) => {
    return await Conversation.update(
      { lastMessageId },
      { where: { id: conversationId }, ...options },
    );
  },

  getParticipantIds: async (conversationId) => {
    const participants = await Participant.findAll({
      where: { conversationId },
      attributes: ["userId"],
      raw: true,
    });

    return participants.map((p) => p.userId);
  },

  incrementLike: async (targetId, options = {}) => {
    return Message.increment("likeCount", {
      by: 1,
      where: { id: targetId },
      ...options,
    });
  },

  decrementLike: async (targetId, options = {}) => {
    return Message.decrement("likeCount", {
      by: 1,
      where: { id: targetId },
      ...options,
    });
  },

  findById: async (targetId) => {
    return await Message.findOne({
      where: { id: targetId },
    });
  },
};
