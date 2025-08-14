const db = require("../config/db");

// Find user by email
const findUserByEmail = async (email) => {
  const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return results[0]; 
};

// Create new user
const createUserInDB = async (username, email, hashedPassword , isAdmin = false) => {
  const [results] = await db.query(
    "INSERT INTO users (username, email, password , is_admin) VALUES (?, ?, ? , ?)",
    [username, email, hashedPassword , isAdmin ? 1 : 0]
  );
  return results.insertId;
};

module.exports = { findUserByEmail, createUserInDB};
