const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "1234567890qwertyuiopasdfghjk";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. Token missing.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user; // 🔥 This is necessary
    next();
  });
};

module.exports = authenticateToken;
