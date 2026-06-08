import { Model, DataTypes } from "sequelize";
import sequelize from "../../../shared/config/database.js";

class Conversation extends Model {}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM("direct", "group"),
      defaultValue: "direct",
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    lastMessageId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "conversation",
    tableName: "conversations",

    indexes: [{ fields: ["updated_at"] }],
  },
);

export default Conversation;
