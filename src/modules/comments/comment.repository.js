import Post from "../posts/post.model.js";
import User from "../users/user.model.js";
import Comment from "./comment.model.js";

export const commentRepository = {
  findById: async (parentId, options = {}) => {
    return await Comment.findOne({
      where: { id: parentId },
      ...options,
    });
  },

  createComment: async (
    { authorId, postId, parentId, content },
    options = {},
  ) => {
    return await Comment.create(
      {
        authorId,
        postId,
        parentId,
        content,
      },
      options,
    );
  },

  getComments: async ({ postId, page, limit }) => {
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        postId,
        parentId: null, // Chỉ lấy các comment gốc
      },
      limit: parsedLimit,
      offset: offset,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "fullName", "avatarUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true, // Thêm dòng này để Sequelize đếm chính xác số lượng Comment (tránh bị nhân đôi do include)
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage: parsedPage,
      limit: parsedLimit,
      comments: rows,
    };
  },

  getReplies: async ({ parentId, page, limit }) => {
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows } = await Comment.findAndCountAll({
      where: {
        parentId: parentId,
      },
      limit: parsedLimit,
      offset: offset,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "fullName", "avatarUrl"],
        },
      ],
      order: [["createdAt", "ASC"]], // Giữ ASC để reply cũ lên trước (giống FB)
      distinct: true, // Đảm bảo đếm chính xác số lượng
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / parsedLimit),
      currentPage: parsedPage,
      limit: parsedLimit,
      replies: rows,
    };
  },
};
