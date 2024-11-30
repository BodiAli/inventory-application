const pool = require("./pool");

async function getAllCategories() {
  const { rows } = await pool.query(
    "SELECT * FROM categories WHERE category_name NOT IN ('Smart Phones', 'Laptops', 'Smart Watches');"
  );
  return rows;
}

async function getFeaturedCategories() {
  const { rows } = await pool.query(
    "SELECT * FROM categories WHERE category_name IN ('Smart Phones', 'Laptops', 'Smart Watches');"
  );
  return rows;
}

async function getAllCategoriesLimitFive() {
  const { rows } = await pool.query("SELECT * FROM categories LIMIT 5;");

  return rows;
}

async function getIPhone12() {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_name='iPhone 12';");
  return rows;
}

module.exports = {
  getAllCategories,
  getFeaturedCategories,
  getAllCategoriesLimitFive,
  getIPhone12,
};
