const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { validateToken } = require("../middlewares/auth");
const { validateAdmin } = require("../middlewares/admin");

// const postCtrl = require("../controllers/post");

router.get("/", validateToken, async (req, res) => {
  // on récupère tous les posts
  const listOfPosts = await Posts.findAll(
    // on embarque également les Likes pour les traiter
    { include: [Likes] },
    // { include: [Comments] },
    { order: ["id", "DESC"] }
  );
  // on cherche les posts likés par le user
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  // on renvoie l'objet
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/:id", async (req, res) => {
  // on récupère la data dans les params de la req
  const id = req.params.id;
  // on cherche la primary key correspondante dans l'array Posts
  const post = await Posts.findByPk(id);
  // on renvoie
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  // on récupère la data dans les params de la req
  const id = req.params.id;
  // on cherche la primary key correspondante dans l'array Posts
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  // on renvoie
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  // on récupère la data du body de la req
  const post = req.body;
  const username = req.user.username;
  const userId = req.user.id;
  post.username = username;
  post.UserId = userId;
  // on crée l'entrée dans l'array Posts
  await Posts.create(post);
  // on renvoie
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  // on récupère la data
  const postId = req.params.postId;
  // on supprime la ligne du post correspondant à l'id récupérée
  await Posts.destroy({ where: { id: postId }, include: [Likes] });
  // on renvoie une simple string en res
  res.json("Publication supprimée");
});

// get all Posts where is flagged = true  (admin only)  //
router.get("/read/flagged", validateAdmin, async (req, res) => {
  const listOfPosts = await Posts.findAll({ where: { isFlagged: true } });
  res.json(listOfPosts);
});

// flag a post
router.put("/flag/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const post = await Posts.findByPk(postId);
  post.isFlagged = true;
  await post.save();
  res.json("Publication signalée");
});

// unflag a post
router.put("/unflag/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const post = await Posts.findByPk(postId);
  post.isFlagged = false;
  await post.save();
  res.json("Publication désignalée");
});

module.exports = router;
