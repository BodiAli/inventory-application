const db = require("../db/queries");

exports.passCurrentRouteToTemplate = (req, res, next) => {
  res.locals.currentPath = req.baseUrl;
  next();
};

exports.getAllCategories = async (req, res) => {
  const categories = await db.getAllCategories();
  const [smartPhones, laptops, smartWatches] = await db.getFeaturedCategories();

  res.render("categories", { title: "Categories", categories, smartPhones, laptops, smartWatches });
};
