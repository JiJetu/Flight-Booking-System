const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
