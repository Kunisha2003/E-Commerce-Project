const express = require("express");
const formidable = require("express-formidable")
const router = express.Router();
const {authenticate , authorizeAdmin} = require("../middlewares/authMiddleware");
const checkId = require("../middlewares/checkId")
const {
    addProduct,
    updateProductDetails,
    deleteProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
    getProductReviews,
  } = require("../controllers/productController");
  
  router.get("/getProducts" , fetchProducts);
  router.post("/addProduct" , authenticate, authorizeAdmin, formidable(), addProduct);
  router.put("/updateProduct/:id" , authenticate , authorizeAdmin , formidable () , 
  updateProductDetails)
  router.delete("/deleteProduct/:id" , authenticate , authorizeAdmin , deleteProduct);
  router.get("/allproducts" , fetchAllProducts);
  router.get("/topProducts", fetchTopProducts);
  router.get("/reviews/:id", getProductReviews); 
router.post("/reviews/:id" , authenticate  , addProductReview)
  router.get("/:id" , fetchProductById);
  router.get("/newProducts", fetchNewProducts);
  router.post("/filteredProducts" , filterProducts);

  module.exports = router;