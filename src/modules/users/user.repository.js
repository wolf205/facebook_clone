import User from "./user.model.js";

export const userRepository = {
  findUserById: (id) => {
    return User.findOne({ where: id });
  },

  updateProfile: async ({
    id,
    firstName,
    lastName,
    bio,
    avatarUrl,
    coverPhotoUrl,
  }) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (coverPhotoUrl !== undefined) user.coverPhotoUrl = coverPhotoUrl;

    user.save();

    return user;
  },
};
