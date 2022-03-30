const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");

router.post("/", async (req, res) => {
  const { email, username, password } = req.body;
  const user = await Users.findOne({ where: { username } });
  const userEmail = await Users.findOne({ where: { email } });
  let isAdmin = false;
  if (user) {
    res.status(400).send("L'utilisateur existe déjà");
  } else if (userEmail) {
    res.status(400).send("L'email existe déjà");
  } else {
    if (password.match(process.env.ADMIN_PASSWORD)) {
      isAdmin = true;
    }
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        email: email,
        username: username,
        password: hash,
        isAdmin: isAdmin,
      });
      res.status(200).send("Compte crée");
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;
  const user = await Users.findOne({ where: { email: email } });
  if (!user) {
    res.status(400).send("Nom d'utilisateur introuvable");
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.status(400).send("Mot de passe incorrect");
      } else {
        const token = sign(
          {
            email: user.email,
            username: user.username,
            id: user.id,
            isAdmin: user.isAdmin,
          },
          process.env.TOKEN
        );
        res.json({
          token: token,
          username: username,
          id: user.id,
          isAdmin: user.isAdmin,
        });
      }
      res.status(200).send("Connexion réussie");
    });
  }
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

router.put("/password", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({
    where: { username: req.user.username },
  });
  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) {
      res.status(400).send("Mot de passe incorrect");
    } else {
      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update(
          { password: hash },
          { where: { username: req.user.username } }
        );
        res.status(200).send("Mot de passe modifié avec succès.");
      });
    }
  });
});

// router for a user to delete his account with password confirmation and token validation
router.delete("/", validateToken, async (req, res) => {
  const { password } = req.body;
  const user = await Users.findOne({
    where: { username: req.user.username },
  });
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      res.status(400).send("Mot de passe incorrect");
    } else {
      Users.destroy({ where: { username: req.user.username } });
      res.status(200).send("Compte supprimé");
    }
  });
});

module.exports = router;
