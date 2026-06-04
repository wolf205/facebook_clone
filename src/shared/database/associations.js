import User from "../../modules/users/user.model.js";
import Session from "../../modules/auth/session.model.js";
import Post from "../../modules/posts/post.model.js";
import PostMedia from "../../modules/posts/postMedia.model.js";

export const setupAssociations = () => {
  // Auth & User
  User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
  Session.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Post && User
  User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
  Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

  // Post && PostMedia
  Post.hasMany(PostMedia, { foreignKey: "postId", as: "media" });
  PostMedia.belongsTo(Post, { foreignKey: "postId", as: "post" });
};
