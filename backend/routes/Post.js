const express = require("express");
const router = express.Router();
const { Posts } = require("../models/Posts");

// const postCtrl = require("../controllers/post");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll();
  res.json(listOfPosts);
});

router.post("/", async (req, res) => {
  const post = req.body;
  await Posts.create(post);
  res.json(post);
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
