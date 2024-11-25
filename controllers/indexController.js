const db = require("../db/queries");

// TODO: Show categories in index.ejs navbar

exports.getIndexPage = async (req, res) => {
  const categories = await db.getAllCategories();
  console.log(categories);

  res.render("index", {
    title: "Home",
    category: "Smart Phones",
    description:
      "lorem ipsum lorem ipsume lorem ipsum lorem ipsume lorem ipsum lorem ipsume lorem ipsum lorem ipsume",
    categories: [{ category_name: "koko" }],
  });
};
