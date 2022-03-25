const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");

router.post("/", async (req, res) => {
  const { email, username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      email: email,
      username: username,
      password: hash,
    });
    res.json("Compte crée");
  });
});

router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });
  if (!user) res.json({ error: "Email inconnu" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "Mot de passe incorrect" });
    const token = sign(
      { email: user.email, username: user.username, id: user.id },
      process.env.TOKEN
    );
    // ajouter isAdmin dans token
    res.json({ token: token, username: username, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo);
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
