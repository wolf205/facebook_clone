import User from "./user.model.js";

export const userRepository = {
  findUserById: (id) => {
    return User.findByPk(id);
  },

  updateProfile: async ({ id, ...updateData }) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    user.set(updateData);
    user.save();

    return user;
  },

  
};
