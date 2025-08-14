const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} = require("../controllers/orderController");

const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.post("/createOrder" , authenticate, createOrder)
router.get("/getAllOrders" , authenticate, authorizeAdmin, getAllOrders);
router.get("/getUserOrder" , authenticate, getUserOrders);
router.get("/totalOrders" , countTotalOrders);
router.get("/totalSales" , calculateTotalSales);
router.get("/total-sales-by-date" , calculateTotalSalesByDate);
router.get("/:id" , authenticate, findOrderById);
router.put("/:id/pay" , authenticate, markOrderAsPaid);
router.put("/:id/deliver" , authenticate, authorizeAdmin, markOrderAsDelivered);

module.exports = router;
