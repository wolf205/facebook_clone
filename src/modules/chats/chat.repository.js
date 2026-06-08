import User from "../users/user.model.js";
import Conversation from "./models/conversation.model.js";
import Participant from "./models/participant.model.js";

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
};
