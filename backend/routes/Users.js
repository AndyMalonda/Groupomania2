const express = require("express");
const router = express.Router();
const { Users } = require("../models/Users");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      email: email,
      password: hash,
    });
    res.json("success");
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });
  if (!user) res.json({ error: "Email inconnu" });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "Mot de passe incorrect" });
    res.json("Vous êtes connecté");
  });
});

// router.post("/register", userCtrl.register);
// router.post("/login", userCtrl.login);

module.exports = router;
