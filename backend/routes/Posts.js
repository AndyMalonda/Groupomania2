const express = require("express");
const router = express.Router();
const { Posts, Likes, Comments } = require("../models");
const { validateToken } = require("../middlewares/auth");

// const postCtrl = require("../controllers/post");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll(
    { include: [Likes] },
    // { include: [Comments] },
    { order: ["id", "DESC"] }
  );
  res.json(listOfPosts);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.post("/", async (req, res) => {
  const post = req.body;
  await Posts.create(post);
  res.json(post);
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
