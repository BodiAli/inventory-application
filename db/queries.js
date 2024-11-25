const pool = require("./pool");

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories;");

  return rows;
}

getAllCategories();

module.exports = {
  getAllCategories,
};
