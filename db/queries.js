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

async function getNumberOfCategoriesByName(name) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM categories WHERE category_name = $1", [name]);

  return rows;
}

async function getNumberOfCategoriesThatIsNotThisId(id, name) {
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM categories WHERE category_name = $1 AND category_id != $2",
    [name, id]
  );

  return rows;
}

async function createCategory(categoryName) {
  await pool.query("INSERT INTO categories (category_name) VALUES ($1);", [categoryName]);
}

async function updateCategory(id, categoryName) {
  await pool.query("UPDATE categories SET category_name = $2 WHERE category_id = $1", [id, categoryName]);
}

async function getIPhone12() {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_name = 'iPhone 12';");
  return rows;
}

module.exports = {
  getAllCategories,
  getAllCategoriesLimitFive,
  getCategory,
  getNumberOfCategoriesByName,
  getNumberOfCategoriesThatIsNotThisId,
  createCategory,
  updateCategory,
  getIPhone12,
};
