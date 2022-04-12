module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    "Posts",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(3500),
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(600),
        allowNull: false,
      },
      isFlagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }
    // { timestamps: false }
  );

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      onDelete: "cascade",
    });
  };
  return Posts;
};
