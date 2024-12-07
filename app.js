require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const itemsRouter = require("./routes/itemsRouter");
const colorsRouter = require("./routes/colorsRouter");

const app = express();

const passCurrentRouteToTemplate = (req, res, next) => {
  res.locals.currentPath = req.originalUrl;
  next();
};

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/categories", passCurrentRouteToTemplate, categoriesRouter);
app.use("/items", passCurrentRouteToTemplate, itemsRouter);
app.use("/colors", passCurrentRouteToTemplate, colorsRouter);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Express app listening on port ${port}`);
});
