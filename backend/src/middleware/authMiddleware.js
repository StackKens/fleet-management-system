function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ message: "no token provided!, access denied" });
  }
  next();
}

module.exports = authMiddleware;
