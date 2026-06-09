import { AppError } from "../../shared/exceptions/AppError.js";
import { chatRepository } from "./chat.repository.js";
import { userRepository } from "../users/user.repository.js";
import sequelize from "../../shared/config/database.js";
import { getMediaTypeFromUrl } from "../../shared/utils/file.js";

export const chatService = {
  createConversation: async ({ userId, data }) => {
    const { type, name, participants } = data;
    const uniqueParticipants = [
      ...new Set(participants.filter((id) => id !== userId)),
    ];

    const validIds = await userRepository.findActiveUserIds(uniqueParticipants);

    const inValidIds = uniqueParticipants.filter(
      (id) => !validIds.includes(id),
    );

    if (inValidIds.length > 0) {
      throw new AppError(
        `Danh sách người tham gia không hợp lệ: ${inValidIds.join(", ")}`,
        400,
        "INVALID_PARTICIPANTS",
      );
    }

    const allMemberIds = [userId, ...validIds];

    const participantData = allMemberIds.map((id) => ({
      userId: id,
    }));

    const t = await sequelize.transaction();

    try {
      const conversation = await chatRepository.createConversation(
        {
          type,
          name,
          participantData,
        },
        { transaction: t },
      );

      await conversation.reload({ transaction: t });

      await t.commit();

      return {
        conversation,
      };
    } catch (error) {
      await t.rollback();
      throw new AppError(`Lỗi khi tạo conversation: ${error.message}`, 500);
    }
  },

  getMessages: async ({ userId, conversationId, page, limit }) => {
    const isParticipant = await chatRepository.isParticipant({
      userId,
      conversationId,
    });

    if (!isParticipant) {
      throw new AppError(
        "Bạn không phải thành viên của cuộc hội thoại, không có quyền xem tin nhắn",
        403,
        "UN_AUTHORIZATION",
      );
    }

    const messages = await chatRepository.getMessages({
      conversationId,
      page,
      limit,
    });

    if (!messages) {
      throw new AppError("Cuộc hội thoại không tồn tại", 400, "BAD_REQUEST");
    }

    return messages;
  },

  sendMessage: async ({ userId, data }) => {
    const { conversationId, content, type, media } = data;

    const existingConversation =
      await chatRepository.isExistsConversation(conversationId);

    if (!existingConversation) {
      throw new AppError("Cuộc hội thoại không tồn tại", 400, "BAD_REQUEST");
    }

    const t = await sequelize.transaction();
    try {
      const formatedMedia = media.map((item, index) => ({
        mediaUrl: item.url,
        publicId: item.publicId,
        mediaType: getMediaTypeFromUrl(item.url),
        orderIndex: index,
      }));

      const message = await chatRepository.sendMessage(
        {
          userId,
          conversationId,
          content,
          type,
          formatedMedia,
        },
        { transaction: t },
      );

      const lastMessageId = message.id;

      await chatRepository.updateLastMessage(
        { conversationId, lastMessageId },
        { transaction: t },
      );

      await t.commit();
      return message;
    } catch (error) {
      await t.rollback();
      throw new AppError(error.message, 500);
    }
  },

  getConversations: async (userId) => {
    const conversations = await chatRepository.getConversations(userId);

    return conversations;
  },
};
