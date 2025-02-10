const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("node:fs/promises");
const db = require("../db/queries");
const cloudinary = require("../config/cloudinaryConfig");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const upload = multer({ dest: "uploads/" });

exports.getAllItems = asyncHandler(async (req, res) => {
  const items = await db.getAllItems();

  if (!items || items.length === 0) {
    throw new CustomNotFoundError("No items found");
  }

  res.render("items", { title: "Items", items });
});

exports.getItem = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new CustomNotFoundError("Item not found");
  }
  const [item] = await db.getItem(id);

  if (!item) {
    throw new CustomNotFoundError("Item not found");
  }

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
  body("itemImage").custom(async (value, { req }) => {
    if (req.file.size > 2097152) {
      await fs.rm(req.file.path);
      throw new Error("File cannot be larger than 2MB");
    } else if (!req.file.mimetype.startsWith("image/")) {
      await fs.rm(req.file.path);
      throw new Error("File uploaded is not of type image");
    }
    return true;
  }),
];

exports.createItem = [
  upload.single("itemImage"),
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

    const { secure_url: url } = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });

    const itemId = await db.createItem(itemName, itemDescription, itemPrice, category, url);

    await fs.rm(req.file.path);

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
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new CustomNotFoundError("Item not found");
  }

  const [item] = await db.getItem(id);

  if (!item) {
    throw new CustomNotFoundError("Item not found");
  }

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

const validateItemUpdate = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage(`Item name ${emptyErr}`)
    .custom(async (value, { req }) => {
      const [{ count }] = await db.getNumberOfItemsThatIsNotThisId(req.params.id, value);

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

exports.updateItem = [
  validateItemUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const [item] = await db.getItem(id);
      const colorsInItem = await db.getColorsInItem(id);
      const colors = await db.getAllColors();
      const categories = await db.getAllCategories();
      return res.status(400).render("update-item", {
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
  }),
];

exports.deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await db.deleteItem(id);

  res.redirect("/items");
});
