const db = require("../config/db");
const Order = require("../models/orderModel")
const Product = require("../models/productsModel")

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = +(itemsPrice * taxRate).toFixed(2);
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    itemsPrice: +itemsPrice.toFixed(2),
    shippingPrice: +shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  const userId = req.user.id;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }

  try {
    const itemIds = orderItems.map((item) => item.id);
    const [products] = await db.query(
      "SELECT id, price FROM products WHERE id IN (?)",
      [itemIds]
    );

    const dbOrderItems = orderItems.map((item) => {
      const dbProduct = products.find((p) => p.id === item.id);
      if (!dbProduct) throw new Error(`Product not found: ${item.id}`);
      return { ...item, product: item.id, price: dbProduct.price };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const [orderResult] = await db.query(
      `INSERT INTO orders (user_id, payment_method, items_price, tax_price, shipping_price, total_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice]
    );
    const orderId = orderResult.insertId;

    await db.query(
      `INSERT INTO shipping_addresses (order_id, address, city, postal_code, country)
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderId,
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.postalCode,
        shippingAddress.country,
      ]
    );

    for (const item of dbOrderItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, name, qty, image, price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product, item.name, item.qty, item.image, item.price]
      );
    }

    // Fetch the created order
    const [createdOrder] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    // Fetch shipping address for the order
    const [shipping] = await db.query(
      `SELECT address, city, postal_code AS postalCode, country
       FROM shipping_addresses WHERE order_id = ?`,
      [orderId]
    );

    // Merge and send the response
    res.status(201).json({
      ...createdOrder[0],
      shippingAddress: shipping[0] || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT orders.*, users.username 
      FROM orders 
      JOIN users ON orders.user_id = users.id
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const [[{ count }]] = await db.query(
      "SELECT COUNT(*) as count FROM orders"
    );
    res.json({ totalOrders: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT COALESCE(SUM(total_price), 0) AS totalSales FROM orders"
    );
    const totalSales = result[0].totalSales;
    res.json({ totalSales});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSalesByDate = async (req, res) => {
  try {
    const [salesByDate] = await db.query(`
      SELECT DATE(paid_at) as date, SUM(total_price) as totalSales
      FROM orders
      WHERE is_paid = true
      GROUP BY DATE(paid_at)
    `);
    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const [orders] = await db.query(
      `
      SELECT orders.*, users.username, users.email 
      FROM orders 
      JOIN users ON orders.user_id = users.id 
      WHERE orders.id = ?
    `,
      [req.params.id]
    );

    if (orders.length === 0)
      return res.status(404).json({ error: "Order not found" });

    const [items] = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [req.params.id]
    );
    const [shipping] = await db.query(
      `SELECT * FROM shipping_addresses WHERE order_id = ?`,
      [req.params.id]
    );
    const [paymentResult] = await db.query(
      `SELECT * FROM payment_results WHERE order_id = ?`,
      [req.params.id]
    );

    res.json({
      ...orders[0],
      orderItems: items,
      shippingAddress: shipping[0] || null,
      paymentResult: paymentResult[0] || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const { id, status, update_time, payer } = req.body;

    await db.query(
      `
      INSERT INTO payment_results (order_id, payment_id, status, update_time, email_address)
      VALUES (?, ?, ?, ?, ?)
    `,
      [req.params.id, id, status, update_time, payer.email_address]
    );

    await db.query(
      `UPDATE orders SET is_paid = true, paid_at = NOW() WHERE id = ?`,
      [req.params.id]
    );

    const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    res.status(200).json(order[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    await db.query(
      `UPDATE orders SET is_delivered = true, delivered_at = NOW() WHERE id = ?`,
      [req.params.id]
    );
    const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);
    res.json(order[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
