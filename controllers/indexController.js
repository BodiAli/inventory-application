const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.getIndexPage = asyncHandler(async (req, res) => {
  const categories = await db.getAllCategoriesLimitFive();
  const [iPhone12] = await db.getIPhone12();

  res.render("index", {
    title: "Home",
    featuredItem: iPhone12,
    categories,
  });
});
