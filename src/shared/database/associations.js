import User from "../../modules/users/user.model.js";
import Session from "../../modules/auth/session.model.js";
import Post from "../../modules/posts/post.model.js";
import PostMedia from "../../modules/posts/postMedia.model.js";
import FriendRequest from "../../modules/friends/friendRequest.model.js";
import Friendship from "../../modules/friends/friendship.model.js";

export const setupAssociations = () => {
  // Auth & User
  User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
  Session.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Post && User
  User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
  Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

  // Post && PostMedia
  Post.hasMany(PostMedia, {
    foreignKey: "postId",
    as: "media",
    onDelete: "CASCADE",
  });
  PostMedia.belongsTo(Post, { foreignKey: "postId", as: "post" });

  // User && FriendRequest
  User.hasMany(FriendRequest, { foreignKey: "senderId", as: "sentRequests" });
  User.hasMany(FriendRequest, {
    foreignKey: "receiverId",
    as: "receivedRequests",
  });

  FriendRequest.belongsTo(User, { foreignKey: "senderId", as: "sender" });
  FriendRequest.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

  // User && Friendship
  User.hasMany(Friendship, { foreignKey: "userId", as: "friendships" });

  Friendship.belongsTo(User, { foreignKey: "userId", as: "user" });
  Friendship.belongsTo(User, { foreignKey: "friendId", as: "friendInfo" });
};
