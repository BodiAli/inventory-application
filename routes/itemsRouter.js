const { Router } = require("express");
const itemsController = require("../controllers/itemsController");

const itemsRouter = Router();

itemsRouter.get("/", itemsController.getAllItems);
itemsRouter.get("/create", itemsController.getCreateItemForm);
itemsRouter.post("/create", itemsController.createItem);
itemsRouter.get("/:id", itemsController.getItem);

module.exports = itemsRouter;
