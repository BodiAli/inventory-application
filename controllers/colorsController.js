const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { validateHTMLColorName } = require("validate-color");
const db = require("../db/queries");

exports.getAllColors = asyncHandler(async (req, res) => {
  const colors = await db.getAllColors();
  res.render("colors", { title: "All Colors", colors });
});

const isValidColorNameErr = "must be a valid color name";
const emptyErr = "can not be empty";

const validateColors = [
  body("colorName")
    .trim()
    .notEmpty()
    .withMessage(`Color name ${emptyErr}`)
    .custom((value) => {
      const isValid = validateHTMLColorName(value);

      if (!isValid) {
        throw new Error(`Color name ${isValidColorNameErr}`);
      }
      return true;
    })
    .custom(async (value) => {
      const [{ count }] = await db.getNumberOfColorsByName(value);

      if (Number(count) > 0) {
        throw new Error("Color name already exists.");
      }
      return true;
    }),
];

exports.createColor = [
  validateColors,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const colors = await db.getAllColors();
      const categories = await db.getAllCategories();

      res.status(400).render("create-item", {
        title: "Create Item",
        colors,
        categories,
        colorsError: errors.array(),
      });
      return;
    }

    const { colorName } = req.body;

    await db.createColor(colorName);

    res.redirect("/items/create");
  }),
];

exports.getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [color] = await db.getColor(id);
  const items = await db.getItemsInColor(id);

  res.render("color", { title: color.color_name, color, items });
});
