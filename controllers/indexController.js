const db = require("../db/queries");

exports.getIndexPage = async (req, res) => {
  const categories = await db.getAllCategories();

  res.render("index", {
    title: "Home",
    category: "Smart Phones",
    description:
      "lorem ipsum lorem ipsume lorem ipsum lorem ipsume lorem ipsum lorem ipsume lorem ipsum lorem ipsume",
    categories,
  });
};
