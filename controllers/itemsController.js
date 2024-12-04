const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

exports.getAllItems = asyncHandler(async (req, res) => {
  const items = await db.getAllItems();

  res.render("items", { title: "Items", items });
});

exports.getItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [item] = await db.getItem(id);
  const colorsInItem = await db.getColorsInItem(id);
  console.log(item);

  // const isItemFeatured =
  //   item.item_name === "iPhone 12" ||
  //   item.item_name === "MacBook Air (M2)" ||
  //   item.item_name === "Apple Watch Series 8";
  const isItemFeatured = false;

  res.render("item", { title: item.item_name, item, isItemFeatured, colorsInItem });
});
