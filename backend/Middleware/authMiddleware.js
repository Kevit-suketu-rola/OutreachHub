const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // const token = req.headers.authorization.split(" ")[1].toString();

  const authHeader =
    req.headers.authorization || req.headers["x-forwarded-authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : null;

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.adminId) {
      req.user = { adminId: verified.adminId };
    } else if (verified.userId) {
      req.user = { userId: verified.userId };
    }
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
