const jwt = require('jsonwebtoken');

const requireSignIn = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

module.exports = {
  requireSignIn: (req, res, next) => {
      console.log("Middleware berjalan");
      next();
  }
};