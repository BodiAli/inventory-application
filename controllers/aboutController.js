const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.getAboutPage = asyncHandler(async (req, res) => {
  const items = await db.getAllItemsLimit5();
  res.render("about", { title: "About", items });
});
