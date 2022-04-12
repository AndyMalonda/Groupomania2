module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING(2200),
      allowNull: false,
    },
    isFlagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      onDelete: "cascade",
    });
    Comments.belongsTo(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Comments;
};
