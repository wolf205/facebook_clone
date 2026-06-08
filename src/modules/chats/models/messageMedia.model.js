import { Model, DataTypes } from "sequelize";
import sequelize from "../../../shared/config/database.js";

class MessageMedia extends Model {}

MessageMedia.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    messageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    publicId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    mediaType: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
    },

    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "messageMedia",
    tableName: "message_media",
    timestamps: false,
    indexes: [{ fields: ["message_id"] }],
  },
);

export default MessageMedia;
