const { verify } = require("jsonwebtoken");

const validateAdmin = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.json({ error: "Utilisateur non connecté" });
  try {
    const validToken = verify(token, process.env.TOKEN);
    req.user = validToken;
    if (validToken.isAdmin) {
      next();
    } else {
      throw new Error("Vous n'êtes pas administrateur");
    }
  } catch (err) {
    return res.json({ error: "Accès refusé" });
  }
};

module.exports = { validateAdmin };
