require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", indexRouter);

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Express app listening on port ${port}`);
});
