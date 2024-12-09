const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await db.getAllCategories();

  if (!categories || categories.length === 0) {
    throw new CustomNotFoundError("No categories found");
  }

  res.render("categories", { title: "Categories", categories });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new CustomNotFoundError("Category not found");
  }

  const rows = await db.getCategory(id);

  if (!rows || rows.length === 0) {
    throw new CustomNotFoundError("Category not found");
  }

  const [category] = rows;

  const hasItems = rows.some((row) => row.item_id !== null);

  const isCategoryFeatured =
    category.category_name === "Smart Phones" ||
    category.category_name === "Laptops" ||
    category.category_name === "Smart Watches";

  res.render("category", { title: category.category_name, category, rows, isCategoryFeatured, hasItems });
});

exports.getCreateCategoryForm = (req, res) => {
  res.render("create-category", { title: "Create Category" });
};

const emptyErr = "can not be empty.";

const validateCategory = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage(`Category name ${emptyErr}`)
    .custom(async (value) => {
      const [{ count }] = await db.getNumberOfCategoriesByName(value);
      if (Number(count) > 0) {
        throw new Error("Category name already exists, please choose a different name.");
      }
      return true;
    }),
];

exports.createCategory = [
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

    return res.redirect("/categories");
  }),
];

exports.getUpdateCategoryForm = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new CustomNotFoundError("Category not found");
  }

  const [category] = await db.getCategory(id);

  if (!category) {
    throw new CustomNotFoundError("Category not found");
  }

  res.render("update-category", {
    title: "Update Category",
    category,
  });
});

const validateCategoryUpdate = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage(`Category name ${emptyErr}`)
    .custom(async (value, { req }) => {
      const [{ count }] = await db.getNumberOfCategoriesThatIsNotThisId(req.params.id, value);
      if (Number(count) > 0) {
        throw new Error("Category name already exists, please choose a different name.");
      }
      return true;
    }),
];

exports.updateCategory = [
  validateCategoryUpdate,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new CustomNotFoundError(
        "Category could have been deleted, moved, or it might have never existed."
      );
    }

    const [category] = await db.getCategory(id);

    if (!category) {
      throw new CustomNotFoundError(
        "Category could have been deleted, moved, or it might have never existed."
      );
    }

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

    return res.redirect(`/categories/${id}`);
  }),
];

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await db.deleteCategory(id);

  res.redirect("/categories");
});
