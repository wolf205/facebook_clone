import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class FriendRequest extends Model {}

FriendRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "friendRequest",
    tableName: "friend_requests",
    indexes: [
      { unique: true, fields: ["sender_id", "receiver_id"] },
      { fields: ["receiver_id", "status"] },
    ],
  },
);

export default FriendRequest;
