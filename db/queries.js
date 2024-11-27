const pool = require("./pool");

async function getAllCategoriesLimitFive() {
  const { rows } = await pool.query("SELECT * FROM categories LIMIT 5;");

  return rows;
}

async function getIPhone12() {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_name='iPhone 12';");
  return rows;
}

module.exports = {
  getAllCategoriesLimitFive,
  getIPhone12,
};
