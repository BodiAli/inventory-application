exports.getIndexPage = (req, res) => {
  res.render("index", {
    title: "Home",
    category: "Smart Phones",
    description:
      "lorem ipsum lorem ipsume lorem ipsum lorem ipsume lorem ipsum lorem ipsume lorem ipsum lorem ipsume",
    categories: [{ category_name: "koko" }],
  });
};
