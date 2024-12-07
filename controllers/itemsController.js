const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

exports.getAllItems = asyncHandler(async (req, res) => {
  const items = await db.getAllItems();

  res.render("items", { title: "Items", items });
});

exports.getItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [item] = await db.getItem(id);
  const colorsInItem = await db.getColorsInItem(id);
  const [category] = await db.getCategory(item.item_category_id);

  const isItemFeatured =
    item.item_name === "iPhone 12" ||
    item.item_name === "MacBook Air (M2)" ||
    item.item_name === "Apple Watch Series 8";

  res.render("item", { title: item.item_name, item, isItemFeatured, colorsInItem, category });
});

exports.getCreateItemForm = asyncHandler(async (req, res) => {
  const colors = await db.getAllColors();
  const categories = await db.getAllCategories();
  res.render("create-item", { title: "Create Item", colors, categories });
});

const emptyErr = "can not be empty";
const validateItem = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage(`Item name ${emptyErr}`)
    .custom(async (value) => {
      const [{ count }] = await db.getNumberOfItemsByName(value);

      if (Number(count) > 0) {
        throw new Error("Item name already exists, please choose a different name.");
      }
      return true;
    }),
  body("itemDescription").trim().notEmpty().withMessage(`Item description ${emptyErr}`),
  body("itemPrice")
    .trim()
    .notEmpty()
    .withMessage(`Item price ${emptyErr}`)
    .isNumeric({ no_symbols: true })
    .withMessage("Item price must be a positive integer"),
];

exports.createItem = [
  validateItem,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const colors = await db.getAllColors();
      const categories = await db.getAllCategories();

      res.status(400).render("create-item", {
        title: "Create Item",
        colors,
        categories,
        errors: errors.array(),
      });
      return;
    }

    const { itemName, itemDescription, itemPrice, category, colors } = req.body;

    const itemId = await db.createItem(itemName, itemDescription, itemPrice, category);

    if (colors && !Array.isArray(colors)) {
      await db.createItemColor(colors, itemId);
    } else if (colors) {
      colors.forEach(async (colorId) => {
        await db.createItemColor(colorId, itemId);
      });
    }

    res.redirect("/items");
  }),
];

exports.getUpdateItemForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [item] = await db.getItem(id);
  const colorsInItem = await db.getColorsInItem(id);
  const colors = await db.getAllColors();
  const categories = await db.getAllCategories();

  res.render("update-item", {
    title: "Update Item",
    item,
    categories,
    colors,
    colorsInItem,
  });
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const [item] = await db.getItem(id);
    const colorsInItem = await db.getColorsInItem(id);
    const colors = await db.getAllColors();
    const categories = await db.getAllCategories();
    return res.status(400).render("update-category", {
      title: "Update Item",
      item,
      categories,
      colors,
      colorsInItem,
      errors: errors.array(),
    });
  }

  const { itemName, itemDescription, itemPrice, category, colors } = req.body;

  await db.updateItem(id, itemName, itemDescription, itemPrice, category);
  await db.updateColorsInItems(colors, id);

  return res.redirect(`/items/${id}`);
});
