const { Router } = require("express");
const itemsController = require("../controllers/itemsController");

const itemsRouter = Router();

itemsRouter.get("/", itemsController.getAllItems);
itemsRouter.get("/:id", itemsController.getItem);

module.exports = itemsRouter;
