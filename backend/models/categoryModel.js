const db = require("../config/db");

const createCategoryTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(32) NOT NULL UNIQUE
      );
    `);
    console.log("Categories table created");
  } catch (err) {
    console.error("Error creating categories table:", err);
  }
};

module.exports = {createCategoryTable}