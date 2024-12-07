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

  const isItemFeatured =
    item.item_name === "iPhone 12" ||
    item.item_name === "MacBook Air (M2)" ||
    item.item_name === "Apple Watch Series 8";

  res.render("item", { title: item.item_name, item, isItemFeatured, colorsInItem });
});

exports.getCreateItemForm = asyncHandler(async (req, res) => {
  const colors = await db.getAllColors();

  res.render("create-item", { title: "Create Item", colors });
});

const emptyErr = "can not be empty";
const validateItem = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage(`item name ${emptyErr}`)
    .custom(async (value) => {
      const [{ count }] = await db.getNumberOfItemsByName(value);

      if (Number(count) > 0) {
        throw new Error("Item name already exists, please choose a different name.");
      }
      return true;
    }),
  body("itemDescription").trim().notEmpty().withMessage(`item description ${emptyErr}`),
  body("itemPrice").trim().notEmpty().withMessage(`item price ${emptyErr}`),
];

exports.createItem = [
  validateItem,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const colors = await db.getAllColors();

      res.status(400).render("create-item", {
        title: "Create Item",
        colors,
        errors: errors.array(),
      });
      return;
    }

    const { itemName, itemDescription, itemPrice, colors } = req.body;
    const itemId = await db.createItem(itemName, itemDescription, itemPrice);

    colors.forEach(async (colorId) => {
      await db.createItemColor(colorId, itemId);
    });

    res.redirect("/items");
  }),
];
