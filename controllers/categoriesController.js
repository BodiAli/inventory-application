const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const passCurrentRouteToTemplate = (req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
};

exports.getAllCategories = [
  passCurrentRouteToTemplate,
  asyncHandler(async (req, res) => {
    const categories = await db.getAllCategories();

    res.render("categories", { title: "Categories", categories });
  }),
];

exports.getCategory = [
  passCurrentRouteToTemplate,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    const rows = await db.getCategory(id);

    const [category] = rows;

    const hasItems = rows.some((row) => row.item_id !== null);

    const isCategoryFeatured =
      category.category_name === "Smart Phones" ||
      category.category_name === "Laptops" ||
      category.category_name === "Smart Watches";

    res.render("category", { title: category.category_name, category, rows, isCategoryFeatured, hasItems });
  }),
];

exports.getCreateCategoryForm = [
  passCurrentRouteToTemplate,
  asyncHandler(async (req, res) => {
    res.render("create-category", { title: "Create Category" });
  }),
];

const emptyErr = "can not be empty.";

const validateCategory = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage(`Category name ${emptyErr}`)
    .custom(async (value) => {
      const [{ count }] = await db.getNumberOfCategoriesByName(value);
      if (Number(count) > 0) {
        throw new Error("Category already exists please choose a different name.");
      }
    }),
];

exports.createCategory = [
  passCurrentRouteToTemplate,
  validateCategory,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("create-category", {
        title: "Create Category",
        errors: errors.array(),
      });
    }

    const { categoryName } = req.body;
    await db.createCategory(categoryName);
    const backUrl = req.header("Referer") || "/";
    return res.redirect(backUrl);
  }),
];

exports.getUpdateCategoryForm = [
  passCurrentRouteToTemplate,
  asyncHandler(async (req, res) => {
    const [category] = await db.getCategory(req.params.id);

    res.render("update-category", {
      title: "Update Category",
      category,
    });
  }),
];

const validateCategoryUpdate = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage(`Category name ${emptyErr}`)
    .custom(async (value, { req }) => {
      const [{ count }] = await db.getNumberOfCategoriesThatIsNotThisId(req.params.id, value);
      if (Number(count) > 0) {
        throw new Error("Category already exists please choose a different name.");
      }
    }),
];

exports.updateCategory = [
  passCurrentRouteToTemplate,
  validateCategoryUpdate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [category] = await db.getCategory(id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("update-category", {
        title: "Update Category",
        category,
        errors: errors.array(),
      });
    }

    const { categoryName } = req.body;

    await db.updateCategory(id, categoryName);

    const backUrl = req.header("Referer") || "/";
    return res.redirect(backUrl);
  }),
];
