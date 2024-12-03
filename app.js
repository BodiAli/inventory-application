require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Express app listening on port ${port}`);
});
