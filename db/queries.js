const pool = require("./pool");

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories;");
  return rows;
}

async function getAllCategoriesLimitFive() {
  const { rows } = await pool.query("SELECT * FROM categories LIMIT 5;");

  return rows;
}

async function getCategory(id) {
  const { rows } = await pool.query(
    "SELECT * FROM categories LEFT JOIN items ON categories.category_id = items.item_category_id WHERE categories.category_id = $1;",
    [id]
  );

  return rows;
}

async function getIPhone12() {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_name = 'iPhone 12';");
  return rows;
}

module.exports = {
  getAllCategories,
  getAllCategoriesLimitFive,
  getCategory,
  getIPhone12,
};
