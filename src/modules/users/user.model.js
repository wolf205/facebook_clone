import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../shared/config/database.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID, // Đã sửa thành DataTypes.UUID
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    coverPhotoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.lastName} ${this.firstName}`;
      },
    },
  },
  {
    sequelize, // Bắt buộc truyền instance sequelize vào đây
    modelName: "user", // Tương đương với tham số đầu tiên trong sequelize.define
    timestamps: true,
    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["last_name", "first_name"],
      },
      {
        fields: ["role", "is_active"],
      },
    ],
  }
);

export default User;