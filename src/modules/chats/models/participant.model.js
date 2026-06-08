import { Model, DataTypes } from "sequelize";
import sequelize from "../../../shared/config/database.js";

class Participant extends Model {}

Participant.init(
  {
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "participant",
    tableName: "participants",

    indexes: [{ fields: ["user_id", "conversation_id"] }],
  },
);

export default Participant;
