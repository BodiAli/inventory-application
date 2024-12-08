const { Router } = require("express");
const aboutController = require("../controllers/aboutController");

const aboutRouter = Router();

aboutRouter.get("/", aboutController.getAboutPage);

module.exports = aboutRouter;
