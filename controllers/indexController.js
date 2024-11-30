const db = require("../db/queries");

exports.getIndexPage = async (req, res) => {
  const categories = await db.getAllCategoriesLimitFive();
  const [iPhone12] = await db.getIPhone12();

  res.render("index", {
    title: "Home",
    featuredItem: iPhone12,
    categories,
  });
};
