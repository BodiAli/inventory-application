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
  const { rows } = await pool.query("SELECT COUNT(*) FROM categories WHERE category_name ILIKE $1", [name]);

  return rows;
}

async function getNumberOfCategoriesThatIsNotThisId(id, name) {
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM categories WHERE category_name ILIKE $1 AND category_id != $2",
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

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items;");
  return rows;
}

async function getItem(id) {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_id = $1;", [id]);
  return rows;
}

async function createItem(itemName, itemDescription, itemPrice, categoryId) {
  const { rows } = await pool.query(
    "INSERT INTO items (item_name, item_description, item_price, item_category_id) VALUES ($1, $2, $3, $4) RETURNING item_id",
    [itemName, itemDescription, itemPrice, categoryId]
  );

  return rows[0].item_id;
}

async function getNumberOfItemsByName(itemName) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM items WHERE item_name ILIKE $1", [itemName]);
  return rows;
}

async function getColorsInItem(id) {
  const { rows } = await pool.query(
    "SELECT color_name FROM colors JOIN colors_items ON color_id_fk = color_id WHERE item_id_fk = $1;",
    [id]
  );
  return rows;
}

async function getAllColors() {
  const { rows } = await pool.query("SELECT * FROM colors;");
  return rows;
}

async function createColor(colorName) {
  await pool.query("INSERT INTO colors (color_name) VALUES ($1);", [colorName]);
}

async function getNumberOfColorsByName(colorName) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM colors WHERE color_name ILIKE $1", [colorName]);
  return rows;
}

async function createItemColor(colorId, itemId) {
  await pool.query("INSERT INTO colors_items (color_id_fk, item_id_fk) VALUES ($1, $2)", [colorId, itemId]);
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
  getAllItems,
  getItem,
  createItem,
  getNumberOfItemsByName,
  getColorsInItem,
  getAllColors,
  createColor,
  getNumberOfColorsByName,
  createItemColor,
};
