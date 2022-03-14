const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.json({ error: "Utilisateur non connecté" });
  try {
    const validToken = verify(token, process.env.TOKEN);
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
