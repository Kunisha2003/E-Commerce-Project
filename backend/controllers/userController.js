const bcrypt = require("bcryptjs")
const db = require('../config/db');
const asyncHandler = require("../middlewares/asyncHandler");
const {findUserByEmail , createUserInDB} = require("../models/userModel")
const {createToken} = require("../utils/createToken")

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password , isAdmin } = req.body;
  
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the inputs.");
    }
  
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isAdminBool = isAdmin === "true" || isAdmin === true;
  
    const userId = await createUserInDB(username, email, hashedPassword , isAdminBool);
  
    // Fetch user after insert (optional, for full user object)
    const newUser = await findUserByEmail(email);
  
    createToken(res, userId);
  
    res.status(201).json({
      _id: userId,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.is_admin === 1,
    });
  });
  
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const existingUser = await findUserByEmail(email);
  
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  
      if (isPasswordValid) {
        createToken(res, existingUser.id); 
  
        res.status(200).json({
          _id: existingUser.id,
          username: existingUser.username.trim(),
          email: existingUser.email.trim(),
          isAdmin: existingUser.is_admin === 1,
        });
        return;
      }
    }
  
    // If email doesn't exist or password is invalid
    res.status(401).json({ message: "Invalid email or password" });
  });
  
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  });

const getAllUsers = asyncHandler(async (req, res) => {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  });
  
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const [user] = await db.query("SELECT id, username, email FROM users WHERE id = ?", [req.user.id]);
  
    if (user.length > 0) {
      res.json(user[0]);
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  });

  const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
  
    if (user.length > 0) {
      const hashedPassword = req.body.password
        ? await bcrypt.hash(req.body.password, 10)
        : user[0].password;
  
      const [updatedUser] = await db.query(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
        [req.body.username || user[0].username, req.body.email || user[0].email, hashedPassword, req.user.id]
      );
  
      res.json({
        _id: req.user.id,
        username: req.body.username || user[0].username,
        email: req.body.email || user[0].email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });

  const deleteUserById = asyncHandler(async (req, res) => {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
  
    if (user.length > 0) {
    
  
      await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  });

  const getUserById = asyncHandler(async (req, res) => {
    const [user] = await db.query("SELECT id, username, email FROM users WHERE id = ?", 
      [req.params.id]);
  
    if (user.length > 0) {
      res.json(user[0]);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });

  const updateUserById = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);

  if (rows.length > 0) {
    const existingUser = rows[0];

    const updatedUsername = req.body.username || existingUser.username;
    const updatedEmail = req.body.email || existingUser.email;
    const updatedIsAdmin =
    typeof req.body.isAdmin !== "undefined" ? req.body.isAdmin : existingUser.is_admin
    
    
    await db.query(
      "UPDATE users SET username = ?, email = ?, is_admin = ? WHERE id = ?",
      [updatedUsername , updatedEmail , updatedIsAdmin ? 1 :0 , req.params.id]
    );

    res.json({
      _id: req.params.id,
      username: updatedUsername,
      email: updatedEmail,
      isAdmin: !!updatedIsAdmin
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
createUser , loginUser , logoutUser , 
getAllUsers , getCurrentUserProfile , updateCurrentUserProfile , 
deleteUserById , getUserById , updateUserById};
