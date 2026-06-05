import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.UUID, // Sử dụng DataTypes.UUID cho type
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.UUID, // Thay đổi type tương ứng với id của bảng users (VD: UUID hoặc INTEGER)
      allowNull: false,
    },

    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize, // Bắt buộc phải truyền instance sequelize vào đây
    timestamps: true,
    tableName: "refresh_tokens",
    underscored: true,

    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["token"],
      },
    ],
  },
);

export default Session;
