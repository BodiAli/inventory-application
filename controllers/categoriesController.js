const db = require("../db/queries");

exports.passCurrentRouteToTemplate = (req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
};

exports.getAllCategories = async (req, res) => {
  const categories = await db.getAllCategories();

  res.render("categories", { title: "Categories", categories });
};

exports.getCategory = async (req, res) => {
  const id = Number(req.params.id);

  const rows = await db.getCategory(id);

  const [category] = rows;

  const hasItems = rows.some((row) => row.item_id !== null);

  const isCategoryFeatured =
    category.category_name === "Smart Phones" ||
    category.category_name === "Laptops" ||
    category.category_name === "Smart Watches";

  res.render("category", { title: category.category_name, category, rows, isCategoryFeatured, hasItems });
};
