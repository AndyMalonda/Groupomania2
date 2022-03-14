const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      email: email,
      password: hash,
    });
    res.json("Compte crée");
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });
  if (!user) res.json({ error: "Email inconnu" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "Mot de passe incorrect" });
    const token = sign({ email: user.email, id: user.id }, process.env.TOKEN);
    res.json(token);
  });
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
