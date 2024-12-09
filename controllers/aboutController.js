const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

exports.getAboutPage = asyncHandler(async (req, res) => {
  const items = await db.getAllItemsLimit5();
  if (!items || items.length === 0) {
    throw new CustomNotFoundError("No items found");
  }
  res.render("about", { title: "About", items });
});
