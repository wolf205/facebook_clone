import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "Người nhận thông báo",
    },

    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "Người gây ra hành động (người gửi)",
    },

    type: {
      type: DataTypes.ENUM(
        "like_post",
        "like_comment",
        "comment_post",
        "reply_comment",
        "friend_request",
        "friend_accept"
      ),
      allowNull: false,
    },

    content: {
      type: DataTypes.STRING(255), 
      allowNull: true,
    },

    referenceId: {
      type: DataTypes.UUID,
      allowNull: true, 
    },

    referenceType: {
      type: DataTypes.ENUM("post", "comment", "user", "message"),
      allowNull: true,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true, 
    underscored: true,
    modelName: "notification",
    tableName: "notifications",
    
    indexes: [
      { 
        fields: ["user_id", "created_at"], 
      },
      { 
        fields: ["user_id", "is_read"], 
      },
    ],
  }
);

export default Notification;