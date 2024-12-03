const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get(
  "/",
  categoriesController.passCurrentRouteToTemplate,
  categoriesController.getAllCategories
);

categoriesRouter.get(
  "/create",
  categoriesController.passCurrentRouteToTemplate,
  categoriesController.getCreateCategoryForm
);

categoriesRouter.get(
  "/:id",
  categoriesController.passCurrentRouteToTemplate,
  categoriesController.getCategory
);

module.exports = categoriesRouter;
