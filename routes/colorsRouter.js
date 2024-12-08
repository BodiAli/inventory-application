const { Router } = require("express");
const colorsController = require("../controllers/colorsController");

const colorsRouter = Router();

colorsRouter.get("/", colorsController.getAllColors);
colorsRouter.post("/create", colorsController.createColor);
colorsRouter.get("/:id", colorsController.getColor);

module.exports = colorsRouter;
