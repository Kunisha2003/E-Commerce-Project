const asyncHandler = require("../middlewares/asyncHandler");
const Product = require("../models/productsModel");
const db = require('../config/db');

const addProduct = asyncHandler(async(req , res)=>{
    try {
        const {name , description , price , category , quantity , brand , image , countInStock} = req.fields
        
        switch (true) {
            case !name:
              return res.json({ error: "Name is required" });
            case !brand:
              return res.json({ error: "Brand is required" });
            case !description:
              return res.json({ error: "Description is required" });
            case !price:
              return res.json({ error: "Price is required" });
            case !category:
              return res.json({ error: "Category is required" });
            case !quantity:
              return res.json({ error: "Quantity is required" });
            case !image:
                return res.json({ error: "Image is required" });
            case countInStock == null:
               return res.json({ error: "Count in stock is required" });
                
                
          }
      
          const insertQuery = `
            INSERT INTO products 
              (name, description, price, category_id, quantity, brand,image , countInStock , created_at, updated_at)
            VALUES 
              (?, ?, ?, ?, ?, ?, ? , ? ,NOW(), NOW())
          `;
      
          const values = [name, description, price, category, quantity, brand , image ,countInStock];
      
          const [result] = await db.execute(insertQuery, values);
      
          res.json({
            id: result.insertId,
            name,
            description,
            price,
            category,
            quantity,
            brand,
            image
          });

    } catch (error) {
        console.log(error)
        res.status(400).json({error : error.message});
        
    }
})

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image,
      countInStock,
    } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    // Ensure numeric fields are parsed correctly
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity, 10);
    const parsedCountInStock = parseInt(countInStock, 10);

    // Optional debug log
    console.log("Updating product with values:", {
      name,
      description,
      parsedPrice,
      category,
      parsedQuantity,
      brand,
      image,
      parsedCountInStock,
      id: req.params.id,
    });

    const updateQuery = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category_id = ?, quantity = ?, brand = ?, image = ?, countInStock = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const values = [
      name,
      description,
      parsedPrice,
      category,
      parsedQuantity,
      brand,
      image,
      parsedCountInStock,
      req.params.id,
    ];

    const [result] = await db.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      id: req.params.id,
      name,
      description,
      price: parsedPrice,
      category,
      quantity: parsedQuantity,
      brand,
      image,
      countInStock: parsedCountInStock,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

 

  const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete reviews first
    await db.query("DELETE FROM reviews WHERE product_id = ?", [id]);

    // Now delete the product
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

  
 

  const fetchProducts = asyncHandler(async (req, res) => {
    try {
      const pageSize = 6;
      const keyword = req.query.keyword;
      const page = Number(req.query.page) || 1;
      const offset = (page - 1) * pageSize;
  
      let productsQuery = "SELECT * FROM products";
      let countQuery = "SELECT COUNT(*) AS count FROM products";
      const queryParams = [];
      const countParams = [];
  
      if (keyword && keyword !== "undefined") {
        productsQuery += " WHERE name LIKE ?";
        countQuery += " WHERE name LIKE ?";
        const searchTerm = `%${keyword}%`;
        queryParams.push(searchTerm);
        countParams.push(searchTerm);
      }
  
      // 🔥 Append LIMIT/OFFSET directly to the query string
      productsQuery += ` LIMIT ${pageSize} OFFSET ${offset}`;
  
      const [countRows] = await db.execute(countQuery, countParams);
      const count = countRows[0].count;
  
      const [products] = await db.execute(productsQuery, queryParams);
  
      res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        hasMore: page * pageSize < count,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  
  
  
  

const fetchProductById = asyncHandler(async (req, res) => {
    try {
      const productId = req.params.id;

      console.log("Fetching product with ID:", req.params.id);

  
      // 1. Get the product
      const [productRows] = await db.execute(
        "SELECT * FROM products WHERE id = ?",
        [productId]
      );
  
      if (productRows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      const product = productRows[0];
  
      // 2. Get reviews with user info
      const [reviews] = await db.execute(
        `SELECT r.*, u.username, u.email
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.product_id = ?
         ORDER BY r.created_at DESC`,
        [productId]
      );
  
      // 3. Attach reviews to the product
      product.reviews = reviews;
  
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  

  const fetchAllProducts = asyncHandler(async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
        LIMIT 24
      `);
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  const addProductReview = asyncHandler(async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const productId = req.params.id;
      const userId = req.user.id; // Assuming you're attaching user to req
      const username = req.user.username;
  
      // Check if product exists
      const [productRows] = await db.execute("SELECT * FROM products WHERE id = ?", [productId]);
      if (productRows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Check if user already reviewed
      const [reviewRows] = await db.execute(
        "SELECT * FROM reviews WHERE product_id = ? AND user_id = ?",
        [productId, userId]
      );
      if (reviewRows.length > 0) {
        return res.status(400).json({ error: "Product already reviewed" });
      }
  
      // Insert review
      await db.execute(
        `INSERT INTO reviews (product_id, user_id, name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
        [productId, userId, username, rating, comment]
      );
  
      // Update product rating and numReviews
      const [allReviews] = await db.execute(
        `SELECT rating FROM reviews WHERE product_id = ?`,
        [productId]
      );
      const numReviews = allReviews.length;
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;
  
      await db.execute(
        `UPDATE products SET rating = ?, numReviews = ? WHERE id = ?`,
        [avgRating, numReviews, productId]
      );
  
      res.status(201).json({ message: "Review added" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  });

  const getProductReviews = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const [productRows] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch reviews for the product
    const [reviews] = await db.execute(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


  

  const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
      const [products] = await db.query(
        `SELECT * FROM products ORDER BY rating DESC LIMIT 4`
      );
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  });

  const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
      const [products] = await db.execute(
        `SELECT * FROM products ORDER BY created_at DESC LIMIT 5`
      );
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  });

  const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    // Start base query
    let query = "SELECT * FROM products";
    const conditions = [];
    const values = [];

    // Handle checked categories
    if (checked.length > 0) {
      const placeholders = checked.map(() => "?").join(", ");
      conditions.push(`category_id IN (${placeholders})`);
      values.push(...checked);
    }

    // Handle price range
    if (radio.length === 2) {
      conditions.push("price BETWEEN ? AND ?");
      values.push(radio[0], radio[1]);
    }

    // Combine where clause
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Execute query
    const [products] = await db.execute(query, values);
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});


module.exports = {addProduct , updateProductDetails , 
deleteProduct , fetchProductById , fetchAllProducts , addProductReview , fetchTopProducts , 
fetchNewProducts , filterProducts , fetchProducts , getProductReviews}