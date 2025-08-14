const {createCategoryTable} = require("../models/categoryModel")
const asyncHandler = require("../middlewares/asyncHandler")
const db = require('../config/db');

// CREATE CATEGORY
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const [existing] = await db.execute("SELECT * FROM categories WHERE name = ?", [name]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Already exists" });
    }

    const [result] = await db.execute("INSERT INTO categories (name) VALUES (?)", [name]);

    res.status(201).json({
      id: result.insertId,
      name,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE CATEGORY
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const {categoryId}  = req.params;
  
  if (!name) {
    return res.status(400).json({ error: "Name is required to update the category" });
  }

  const [existing] = await db.execute("SELECT * FROM categories WHERE id = ?", [categoryId]);

  if (existing.length === 0) {
    return res.status(404).json({ error: "Category not found" });
  }

  await db.execute("UPDATE categories SET name = ? WHERE id = ?", [name, categoryId]);

  const [updated] = await db.execute("SELECT * FROM categories WHERE id = ?", [categoryId]);
  res.json(updated[0]);
});

// DELETE CATEGORY
const removeCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const [category] = await db.execute("SELECT * FROM categories WHERE id = ?", [categoryId]);

  if (category.length === 0) {
    return res.status(404).json({ error: "Category not found" });
  }

  await db.execute("DELETE FROM categories WHERE id = ?", [categoryId]);
  res.json(category[0]);
});

// LIST ALL CATEGORIES
const listCategory = asyncHandler(async (req, res) => {
  const [categories] = await db.execute("SELECT * FROM categories");
  res.json(categories);
});

// GET SINGLE CATEGORY
const readCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [category] = await db.execute("SELECT * FROM categories WHERE id = ?", [id]);

  if (category.length === 0) {
    return res.status(404).json({ error: "Category not found" });
  }

  res.json(category[0]);
});

module.exports = {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory 
};


module.exports = {createCategory , updateCategory , 
  removeCategory , listCategory , readCategory}