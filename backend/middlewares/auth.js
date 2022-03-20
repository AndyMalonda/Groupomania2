const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.json({ error: "Utilisateur non connecté" });
  try {
    const validToken = verify(token, process.env.TOKEN);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: "Vous n'êtes pas connecté" });
  }
};

module.exports = { validateToken };

// traiter id et email dans auth sessionStorage
