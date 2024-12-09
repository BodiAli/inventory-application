require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const itemsRouter = require("./routes/itemsRouter");
const colorsRouter = require("./routes/colorsRouter");
const aboutRouter = require("./routes/aboutRouter");

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
app.use("/about", passCurrentRouteToTemplate, aboutRouter);

app.use(passCurrentRouteToTemplate, (req, res) => {
  res.render("404-lost", { title: "404 Not found" });
});

app.use(passCurrentRouteToTemplate, (err, req, res, _next) => {
  console.error(err);
  if (err.statusCode === 404) {
    return res.render("404-input", { title: "404 Not found" });
  }
  return res.status(500).send(err.message);
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Express app listening on port ${port}`);
});
