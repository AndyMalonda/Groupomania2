const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const { validateToken } = require("../middlewares/auth");

router.get("/:postId", validateToken, async (req, res) => {
  // on récupère la data dans la req
  const postId = req.params.postId;
  // on récupère tous les comments correspondant au post dans l'array Comments
  const comments = await Comments.findAll({
    where: { PostId: postId },
    include: [Users],
  });
  // on les renvoie en res
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  // on récupère la data dans la req
  const comment = req.body;
  // on récupère le username et l'id de l'utilisateur
  comment.isFlaged = false;
  // on attribue le UserId
  comment.UserId = req.user.id;
  // on attribue la date de création
  comment.createdAt = new Date();
  // on récupère les autres informations du users
  comment.User = await Users.findOne({
    where: { id: comment.UserId },
    attributes: ["username", "avatar"],
  });
  // on crée la ligne dans l'array Comments
  await Comments.create(comment);
  // on renvoie
  res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  // on récupère la data
  const commentId = req.params.commentId;
  // on supprime la ligne du comment correspondant à l'id récupérée
  await Comments.destroy({ where: { id: commentId } });
  // on renvoie une simple string en res
  res.json("Commentaire supprimé");
});

// flag a comment
router.put("/flag/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const comment = await Comments.findByPk(commentId);
  comment.isFlagged = true;
  await comment.save();
  res.json("Commentaire signalé");
});

// unflag a comment
router.put("/unflag/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const comment = await Comments.findByPk(commentId);
  comment.isFlagged = false;
  await comment.save();
  res.json("Commentaire désignalé");
});

// get all Comments where is flagged = true
router.get("/read/flagged", validateToken, async (req, res) => {
  const listOfComments = await Comments.findAll({
    where: { isFlagged: true },
  });
  res.json(listOfComments);
});

module.exports = router;
