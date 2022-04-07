const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const fs = require("fs");

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
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    res.status(400).send("L'utilisateur n'existe pas");
  } else {
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const token = sign(
          {
            email: user.email,
            username: user.username,
            id: user.id,
            isAdmin: user.isAdmin,
          },
          process.env.TOKEN,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          token: token,
          username: username,
          id: user.id,
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(400).send("Mot de passe incorrect");
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res.status(400).send("User not found");
  }
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

router.put("/avatar", validateToken, multer, async (req, res) => {
  // delete the old avatar of the user
  const user = await Users.findOne({
    where: { username: req.user.username },
  });
  if (user.avatar) {
    fs.unlink(`images/${user.avatar}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  const avatar = `/images/${req.file.filename}`;
  Users.update({ avatar: avatar }, { where: { username: req.user.username } });
  res.status(200).send("Avatar modifié avec succès.");
  res.send(avatar);
});

router.delete("/delete", validateToken, async (req, res) => {
  const { password } = req.body;
  const user = await Users.findOne({
    where: { username: req.user.username },
  });
  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) {
      res.status(400).send("Mot de passe incorrect");
    } else {
      await Users.destroy({ where: { username: req.user.username } });
      res.status(200).send("Compte supprimé avec succès");
    }
  });
});

module.exports = router;
