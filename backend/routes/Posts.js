const express = require("express");
const router = express.Router();
const { Posts, Likes, Users, Comments } = require("../models");
const { validateToken } = require("../middlewares/auth");
const { validateAdmin } = require("../middlewares/admin");

// const postCtrl = require("../controllers/post");

router.get("/", validateToken, async (req, res) => {
  // on récupère tous les posts
  const listOfPosts = await Posts.findAll(
    // order by date de création du post (desc), includes les likes et les comments
    {
      order: [["createdAt", "DESC"]],
      include: [{ model: Users }, { model: Likes }, { model: Comments }],
    }
  );
  // on cherche les posts likés par le user
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  // on renvoie l'objet
  res.json({
    listOfPosts: listOfPosts,
    likedPosts: likedPosts,
  });
});

router.get("/:id", validateToken, async (req, res) => {
  // on récupère la data dans les params de la req
  const id = req.params.id;
  // on cherche la primary key correspondante dans l'array Posts
  const post = await Posts.findOne({
    where: { id: id },
    include: [
      { model: Users, attributes: ["id", "username", "avatar"] },
      { model: Likes, attributes: ["id", "UserId"] },
      { model: Comments },
    ],
  });
  // on renvoie
  res.json(post);
});

router.get("/byuserId/:id", validateToken, async (req, res) => {
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

router.post("/create", validateToken, async (req, res) => {
  // on récupère les données dans le body de la req
  const { title, message, imageUrl } = req.body;
  // on crée le post
  const post = await Posts.create({
    title,
    message,
    imageUrl,
    username: req.user.username,
    UserId: req.user.id,
  });
  // on renvoie
  res.json(post);
});

router.post("/", validateToken, async (req, res) => {
  // on récupère la data du body de la req
  const post = req.body;
  // on attribue le UserId
  post.UserId = req.user.id;
  // on crée l'entrée dans l'array Posts
  await Posts.create(post);
  // on renvoie
  res.json(post);
});

router.post("/", validateToken, async (req, res) => {
  // on récupère la data du body de la req
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  // on crée l'entrée dans l'array Posts
  await Posts.create(post);
  // on renvoie
  res.json(post);
});

router.post("/", validateToken, async (req, res) => {
  // on récupère la data du body de la req
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
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
  console.log(postId);
  const post = await Posts.findByPk(postId);
  post.isFlagged = true;
  console.log(post);
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
