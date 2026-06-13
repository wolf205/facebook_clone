import User from "../../modules/users/user.model.js";
import Session from "../../modules/auth/session.model.js";
import Post from "../../modules/posts/post.model.js";
import PostMedia from "../../modules/posts/postMedia.model.js";
import FriendRequest from "../../modules/friends/friendRequest.model.js";
import Friendship from "../../modules/friends/friendship.model.js";
import Participant from "../../modules/chats/models/participant.model.js";
import Conversation from "../../modules/chats/models/conversation.model.js";
import Message from "../../modules/chats/models/message.model.js";
import MessageMedia from "../../modules/chats/models/messageMedia.model.js";
import Like from "../../modules/likes/like.model.js";
import Comment from "../../modules/comments/comment.model.js";

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

  // Conversation & Message (Tin nhắn cuối cùng - Last Message)
  Conversation.belongsTo(Message, {
    foreignKey: "lastMessageId",
    as: "lastMessage",
    constraints: false,
  });

  // Conversation & Participant
  Conversation.hasMany(Participant, {
    foreignKey: "conversationId",
    as: "participants",
    onDelete: "CASCADE",
  });
  Participant.belongsTo(Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
  });

  // User & Participant
  User.hasMany(Participant, { foreignKey: "userId", as: "chatParticipations" });
  Participant.belongsTo(User, { foreignKey: "userId", as: "userInfo" });

  // Conversation & Message (Lịch sử tin nhắn)
  Conversation.hasMany(Message, {
    foreignKey: "conversationId",
    as: "messages",
    onDelete: "CASCADE",
  });
  Message.belongsTo(Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
  });

  // User & Message
  User.hasMany(Message, { foreignKey: "senderId", as: "sentMessages" });
  Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });

  // Message & MessageMedia
  Message.hasMany(MessageMedia, {
    foreignKey: "messageId",
    as: "media",
    onDelete: "CASCADE",
  });
  MessageMedia.belongsTo(Message, { foreignKey: "messageId", as: "message" });

  // User && Like
  User.hasMany(Like, { foreignKey: "userId", as: "likes" });

  Like.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Like && Post
  Post.hasMany(Like, {
    foreignKey: "targetId",
    constraints: false,
    scope: { targetType: "post" },
    as: "likes",
  });

  Like.belongsTo(Post, { foreignKey: "targetId", as: "post" });

  // Like && Message
  Message.hasMany(Like, {
    foreignKey: "targetId",
    constraints: false,
    scope: { targetType: "message" },
    as: "likes",
  });

  Like.belongsTo(Message, { foreignKey: "targetId", as: "message" });

  // Like && Comment
  Comment.hasMany(Like, {
    foreignKey: "targetId",
    constraints: false,
    scope: { targetType: "comment" },
    as: "likes",
  });

  Like.belongsTo(Comment, { foreignKey: "targetId", as: "comment" });

  // User && Comment
  User.hasMany(Comment, { foreignKey: "authorId", as: "comments" });

  Comment.belongsTo(User, { foreignKey: "authorId", as: "author" });

  // Post && Comment
  Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

  Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

  // Comment && Comment
  Comment.hasMany(Comment, { foreignKey: "parentId", as: "children" });

  Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });
};
