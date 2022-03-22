const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/auth");

router.post("/", validateToken, async (req, res) => {
  // on récupère les données contenues dans la requête
  const { PostId } = req.body;
  const UserId = req.user.id;
  // on cherche si le user a déjà liké
  const existing = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });
  if (!existing) {
    // si pas de match, on crée une ligne dans l'array Likes avec les données de la req
    await Likes.create({ PostId: PostId, UserId: UserId });
    // on renvoie un boolean en res pour dicter le comportement de l'UI
    res.json({ liked: true });
  } else {
    // si post déjà liké par le user, on retire la ligne dans l'array et on renvoie un boolean
    await Likes.destroy({ where: { PostId: PostId, UserId: UserId } });
    res.json({ liked: false });
  }
});

module.exports = router;
