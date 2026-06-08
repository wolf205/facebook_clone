import { AppError } from "../../shared/exceptions/AppError.js";
import { chatRepository } from "./chat.repository.js";
import { userRepository } from "../users/user.repository.js";
import sequelize from "../../shared/config/database.js";

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
};
