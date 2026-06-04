import { Model, DataTypes } from "sequelize";
import sequelize from "../../shared/config/database.js";

class PostMedia extends Model {}

PostMedia.init(
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
      references: {
        model: "posts",
        key: "id",
      },
    },

    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    mediaType: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: true,
    },

    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "postMedia",
    tableName: "post_media",
    timestamps: false,
  },
);

export default PostMedia;
