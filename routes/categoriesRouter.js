const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getAllCategories);

categoriesRouter.get("/create", categoriesController.getCreateCategoryForm);
categoriesRouter.post("/create", categoriesController.createCategory);

categoriesRouter.get("/:id/update", categoriesController.getUpdateCategoryForm);
categoriesRouter.post("/:id/update", categoriesController.updateCategory);

categoriesRouter.get("/:id", categoriesController.getCategory);

module.exports = categoriesRouter;
