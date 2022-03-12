const express = require("express");
const router = express.Router();
const { Users } = require("../models/Users");

// const userCtrl = require("../controllers/user");

router.get("/", (req, res) => {
  res.json("ok router");
});

router.post("/", async (req, res) => {
  const user = req.body;
  await Users.create(user);
  res.json(post);
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
