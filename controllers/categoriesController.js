const db = require("../db/queries");

exports.passCurrentRouteToTemplate = (req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
};

exports.getAllCategories = async (req, res) => {
  const categories = await db.getAllCategories();
  const [smartPhones, laptops, smartWatches] = await db.getFeaturedCategories();

  res.render("categories", { title: "Categories", categories, smartPhones, laptops, smartWatches });
};

exports.getCategory = async (req, res) => {
  const { id } = req.params;

  const rows = await db.getCategory(id);
  const [category] = rows;
  res.render("category", { title: category.category_name, category, rows });
};
