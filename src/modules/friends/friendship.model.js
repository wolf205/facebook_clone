import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class Friendship extends Model {}

Friendship.init(
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
    },

    friendId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "friendship",
    tableName: "friendships",
    underscored:  true,
    indexes: [
      { unique: true, fields: ["user_id", "friend_id"] },
      { fields: ["user_id"] },
    ],
  },
);

export default Friendship;
