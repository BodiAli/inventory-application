const { Router } = require("express");
const colorsController = require("../controllers/colorsController");

const colorsRouter = Router();

colorsRouter.get("/", colorsController.getAllColors);
colorsRouter.post("/create", colorsController.createColor);

module.exports = colorsRouter;
