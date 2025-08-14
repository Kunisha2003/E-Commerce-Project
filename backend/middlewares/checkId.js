const db = require("../config/db");

function checkProductExists(tableName = "products") {
  return async (req, res, next) => {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
      res.status(400);
      throw new Error(`Invalid ID format: ${id}`);
    }

    try {
      const [rows] = await db.execute(`SELECT id FROM ${tableName} WHERE id = ?`, [id]);
      if (rows.length === 0) {
        res.status(404);
        throw new Error(`No ${tableName.slice(0, -1)} found with ID: ${id}`);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = checkProductExists;
