const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/auth");

router.get("/:postId", async (req, res) => {
  // on récupère la data dans la req
  const postId = req.params.postId;
  // on récupère tous les comments correspondant au post dans l'array Comments
  const comments = await Comments.findAll({ where: { PostId: postId } });
  // on les renvoie en res
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  // on récupère la data dans la req
  const comment = req.body;
  const username = req.user.username;
  // on attribue l'auteur du commentaire directement à ce dernier
  comment.username = username;
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

module.exports = router;
