const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/auth");

router.get("/:postId", validateToken, async (req, res) => {
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
  comment.isFlaged = false;
  // on crée la ligne dans l'array Comments
  await Comments.create(comment);
  // on renvoie
  res.json(comment);
});

// router.post("/", validateToken, async (req, res) => {
//   try {
//     const comment = await Comments.create({
//       message: req.body.message,
//       PostId: req.body.PostId,
//       UserId: req.body.UserId,
//     });
//     res.send(comment);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

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
