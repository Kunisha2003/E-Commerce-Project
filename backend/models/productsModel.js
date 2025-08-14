const db = require("../config/db");

const createProductsTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        category_id INT NOT NULL,
        description TEXT NOT NULL,
        rating FLOAT NOT NULL DEFAULT 0,
        numReviews INT NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        countInStock INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);
    console.log("Products table created");
  } catch (err) {
    console.error("Error creating products table:", err);
  }
};

const createReviewsTable = async () => {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          rating FLOAT NOT NULL,
          comment TEXT NOT NULL,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        );
      `);
      console.log("Reviews table created");
    } catch (err) {
      console.error("Error creating reviews table:", err);
    }
  };

module.exports = { createProductsTable , createReviewsTable };
