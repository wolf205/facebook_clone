import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "comment",
    tableName: "comments",
    indexes: [{ fields: ["post_id"] }, { fields: ["parent_id"] }],
  },
);

export default Comment;
