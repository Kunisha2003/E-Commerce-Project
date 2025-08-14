const db = require("../config/db");

const createOrdersTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        payment_method VARCHAR(255) NOT NULL,
        items_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
        tax_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
        shipping_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
        total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
        is_paid BOOLEAN NOT NULL DEFAULT FALSE,
        paid_at DATETIME,
        is_delivered BOOLEAN NOT NULL DEFAULT FALSE,
        delivered_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    console.log("Orders table created");
  } catch (err) {
    console.error("Error creating orders table:", err);
  }
};

const createOrderItemsTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        qty INT NOT NULL,
        image VARCHAR(500) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);
    console.log("OrderItems table created");
  } catch (err) {
    console.error("Error creating order_items table:", err);
  }
};

const createShippingAddressesTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS shipping_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL UNIQUE,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);
    console.log("ShippingAddresses table created");
  } catch (err) {
    console.error("Error creating shipping_addresses table:", err);
  }
};

const createPaymentResultsTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS payment_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL UNIQUE,
        payment_id VARCHAR(255),
        status VARCHAR(100),
        update_time VARCHAR(100),
        email_address VARCHAR(255),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);
    console.log("PaymentResults table created");
  } catch (err) {
    console.error("Error creating payment_results table:", err);
  }
};

module.exports = {
  createOrdersTable,
  createOrderItemsTable,
  createShippingAddressesTable,
  createPaymentResultsTable,
};
