module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes");

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      onDelete: "cascade",
    });
    Likes.belongsTo(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Likes;
};
