const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { validateToken } = require("../middlewares/auth");

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

router.post("/", validateToken, async (req, res) => {
  // on récupère la data du body de la req
  const post = req.body;
  const username = req.user.username;
  post.username = username;
  // on crée l'entrée dans l'array Posts
  await Posts.create(post);
  // on renvoie
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  // on récupère la data
  const postId = req.params.postId;
  // on supprime la ligne du post correspondant à l'id récupérée
  await Posts.destroy({ where: { id: postId } });
  // on renvoie une simple string en res
  res.json("Publication supprimée");
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
