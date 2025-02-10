const pool = require("./pool");

// Add an order by to maintain the same rows sequence even after updating
async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY category_id;");
  return rows;
}

async function getAllCategoriesLimitFive() {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY category_id LIMIT 5;");

  return rows;
}

async function getCategory(id) {
  const { rows } = await pool.query(
    "SELECT * FROM categories LEFT JOIN items ON categories.category_id = items.item_category_id WHERE categories.category_id = $1 ORDER BY item_id;",
    [id]
  );

  return rows;
}

async function deleteCategory(id) {
  await pool.query("DELETE FROM categories WHERE category_id = $1", [id]);
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

async function createCategory(categoryName, url) {
  await pool.query("INSERT INTO categories (category_name, category_image_url) VALUES ($1, $2);", [
    categoryName,
    url,
  ]);
}

async function updateCategory(id, categoryName) {
  await pool.query("UPDATE categories SET category_name = $2 WHERE category_id = $1", [id, categoryName]);
}

async function getIPhone12() {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_name = 'iPhone 12';");
  return rows;
}

async function getAllItems() {
  const { rows } = await pool.query("SELECT * FROM items ORDER BY item_id;");
  return rows;
}

async function getAllItemsLimit5() {
  const { rows } = await pool.query("SELECT * FROM items ORDER BY item_id LIMIT 5;");
  return rows;
}

async function getItem(id) {
  const { rows } = await pool.query("SELECT * FROM items WHERE item_id = $1;", [id]);
  return rows;
}

async function deleteItem(id) {
  await pool.query("DELETE FROM items WHERE item_id = $1", [id]);
}

async function createItem(itemName, itemDescription, itemPrice, categoryId, url) {
  const { rows } = await pool.query(
    "INSERT INTO items (item_name, item_description, item_price, item_category_id, item_image_url) VALUES ($1, $2, $3, $4, $5) RETURNING item_id",
    [itemName, itemDescription, itemPrice, categoryId, url]
  );

  return rows[0].item_id;
}

async function getNumberOfItemsByName(itemName) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM items WHERE item_name ILIKE $1", [itemName]);
  return rows;
}

async function getNumberOfItemsThatIsNotThisId(id, itemName) {
  const { rows } = await pool.query("SELECT COUNT(*) FROM items WHERE item_name ILIKE $2 AND item_id != $1", [
    id,
    itemName,
  ]);
  return rows;
}

async function getColorsInItem(id) {
  const { rows } = await pool.query(
    "SELECT color_name FROM colors JOIN colors_items ON color_id_fk = color_id WHERE item_id_fk = $1;",
    [id]
  );
  return rows;
}

async function getItemsInColor(id) {
  const { rows } = await pool.query(
    "SELECT item_id, item_name, item_description, item_price FROM items JOIN colors_items ON item_id_fk = item_id WHERE color_id_fk = $1;",
    [id]
  );
  return rows;
}

async function updateItem(id, itemName, itemDescription, itemPrice, categoryId) {
  await pool.query(
    "UPDATE items SET item_name = $2, item_description = $3, item_price = $4, item_category_id = $5 WHERE item_id = $1",
    [id, itemName, itemDescription, itemPrice, categoryId]
  );
}

async function getAllColors() {
  const { rows } = await pool.query("SELECT * FROM colors;");
  return rows;
}

async function getColor(id) {
  const { rows } = await pool.query("SELECT * FROM colors WHERE color_id = $1;", [id]);

  return rows;
}

async function deleteColor(id) {
  await pool.query("DELETE FROM colors WHERE color_id = $1", [id]);
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

async function updateColorsInItems(colors, itemId) {
  const client = await pool.connect();
  // Queries are in a transaction because PG documentation says you MUST use the SAME client instance
  // If I wanted to update colors I would reverse colors with itemId e.g.(items, colorId)
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM colors_items WHERE item_id_fk = $1", [itemId]);

    if (colors && !Array.isArray(colors)) {
      await client.query("INSERT INTO colors_items (color_id_fk, item_id_fk) VALUES ($1, $2)", [
        colors,
        itemId,
      ]);
    } else if (colors) {
      colors.forEach(async (colorId) => {
        await client.query("INSERT INTO colors_items (color_id_fk, item_id_fk) VALUES ($1, $2)", [
          colorId,
          itemId,
        ]);
      });
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(error);
  } finally {
    client.release();
  }
}

module.exports = {
  getAllCategories,
  getAllCategoriesLimitFive,
  getCategory,
  deleteCategory,
  getNumberOfCategoriesByName,
  getNumberOfCategoriesThatIsNotThisId,
  createCategory,
  updateCategory,
  getIPhone12,
  getAllItems,
  getAllItemsLimit5,
  getItem,
  deleteItem,
  createItem,
  getNumberOfItemsByName,
  getNumberOfItemsThatIsNotThisId,
  getColorsInItem,
  getItemsInColor,
  updateItem,
  getAllColors,
  getColor,
  deleteColor,
  createColor,
  getNumberOfColorsByName,
  createItemColor,
  updateColorsInItems,
};
