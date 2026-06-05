import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    privacy: {
      type: DataTypes.ENUM("public", "friend", "private"),
      defaultValue: "public",
      allowNull: false,
    },

    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "posts",
    modelName: "post",
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ["author_id"] }, { fields: ["privacy"] }],
  },
);

export default Post;
