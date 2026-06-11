import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class Like extends Model {}

Like.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    targetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    targetType: {
      type: DataTypes.ENUM("post", "comment", "message"),
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "like",
    tableName: "like",
    indexes: [
      { unique: true, fields: ["user_id", "target_id", "target_type"] },
    ],
  },
);

export default Like;
