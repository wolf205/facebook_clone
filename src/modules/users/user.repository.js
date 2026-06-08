import User from "./user.model.js";
import { Op } from "sequelize";

export const userRepository = {
  findUserById: (id) => {
    return User.findByPk(id);
  },

  updateProfile: async ({ id, ...updateData }) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    user.set(updateData);
    await user.save();

    return user;
  },

  findActiveUserIds: async (ids) => {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
        isActive: true,
      },
      attributes: ["id"],
      raw: true,
    });

    return users.map((user) => user.id);
  },
};
