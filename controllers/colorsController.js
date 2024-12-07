const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { validateHTMLColorName } = require("validate-color");
const db = require("../db/queries");

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

      res.status(400).render("create-item", {
        title: "Create Item",
        colors,
        colorsError: errors.array(),
      });
      return;
    }

    const { colorName } = req.body;

    await db.createColor(colorName);

    res.redirect("/items/create");
  }),
];
