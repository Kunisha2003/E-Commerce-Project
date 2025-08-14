const express = require("express")
const router = express.Router();
const {authenticate , authorizeAdmin} = require("../middlewares/authMiddleware")
const {createCategory, updateCategory, removeCategory, listCategory, readCategory} = require("../controllers/categoryController")


router.post("/createCategory" , authenticate , authorizeAdmin , createCategory);
router.put("/updateCategory/:categoryId" , authenticate , authorizeAdmin , updateCategory)
router.delete("/deleteCategory/:categoryId" , authenticate , authorizeAdmin , removeCategory)
router.get("/allCategory" , listCategory);
router.get("/getSingleCategory/:id" , readCategory);

module.exports = router ;