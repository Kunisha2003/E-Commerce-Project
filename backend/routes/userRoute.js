const express = require("express");
const {
createUser , loginUser , logoutUser , 
getAllUsers , getCurrentUserProfile , updateCurrentUserProfile , 
deleteUserById ,
getUserById , updateUserById} = require("../controllers/userController")
const {authenticate , authorizeAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register" ,createUser)
router.get("/" , authenticate , authorizeAdmin , getAllUsers);
router.post("/login" , loginUser);
router.post("/logout" , logoutUser);

router.get("/getProfile" , authenticate , getCurrentUserProfile);
router.put("/updateProfile" , authenticate , updateCurrentUserProfile);

router.delete("/delete/:id" , authenticate , authorizeAdmin , deleteUserById);
router.get("/getUser/:id" , authenticate , authorizeAdmin , getUserById);
router.put("/updateUser/:id" , authenticate , authorizeAdmin , updateUserById);

module.exports = router;