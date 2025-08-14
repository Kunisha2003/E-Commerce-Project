const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const db = require("../config/db");

const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const [userRows] = await db.query(
        "SELECT id, username, email, is_admin FROM users WHERE id = ?",
        [userId]
      );

      if (!userRows.length) {
        res.status(401);
        throw new Error("User not found.");
      }

      const dbUser = userRows[0];// Attach user to req

      req.user = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        isAdmin: dbUser.is_admin === 1 // ✅ Convert to boolean
      };
      next();
    } catch (error) {
      console.error("JWT error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

module.exports = { authenticate, authorizeAdmin };
