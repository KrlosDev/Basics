const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");

// image uploading
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

//uploading a single file at a time
var upload = multer({
  storage: storage,
}).single("image");

//routes

//insert user into db
router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    image: req.file.filename,
  });
  user
    .save()
    .then(() => res.send("Successfully uploaded"))
    .catch((err) => console.log(err));
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

//get one user
router.get("/edit/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(404).send("user not found");
  }
});

//update user, not working yet will revisit when building the front end
router.post("/update/:id", upload, async (req, res) => {
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads" + req.body.old_img);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_img;
  }
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    console.log(updatedUser);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "something went wrong" });
  }
});

//Delete
router.get("/delete/:id", async (req, res) => {
  const user = await User.findOneAndRemove({ _id: req.params.id });
  res.send(user);
  console.log("User deleted");
  if (user.image != "") {
    try {
      fs.unlinkSync("./uploads/" + user.image);
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
