//imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

//app.get("/", (req, res) => {
//  res.send("Connected");
//});

//route prefix
app.use("", require("./routes/routes.js"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "qwerty",
    saveUninitialized: true,
    resave: false,
  })
);
//storing session messages
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//db connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    return console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
