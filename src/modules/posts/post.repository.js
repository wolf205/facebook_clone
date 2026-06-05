import Post from "./post.model.js";
import PostMedia from "./postMedia.model.js";

export const postRepository = {
  createPost: async (
    { id, content, privacy, formattedMedia },
    options = {},
  ) => {
    const post = await Post.create(
      {
        authorId: id,
        content,
        privacy,
        media: formattedMedia,
      },
      {
        include: [
          {
            model: PostMedia,
            as: "media",
          },
        ],
        ...options,
      },
    );

    return post;
  },

  updatePost: async ({ postId, content, privacy }, options = {}) => {
    return await Post.update(
      { content, privacy },
      {
        where: { id: postId },
        ...options,
      },
    );
  },

  deleteMediaByPostId: async ({ postId }, options = {}) => {
    return await PostMedia.destroy({
      where: { postId },
      ...options,
    });
  },

  insertMedia: async ({ formattedMedia }, options = {}) => {
    return await PostMedia.bulkCreate(formattedMedia, options);
  },
};
