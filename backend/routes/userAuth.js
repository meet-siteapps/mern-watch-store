// routes/userAuth.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "shhhh", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token Expired, Sign-in your account again" });
    }
    // Set the entire user object from the token
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };