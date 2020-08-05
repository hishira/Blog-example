const express = require("express");
const userModel = require("../models/User");
const app = express();
const passport = require("passport");
function getUserPreview(user) {
  return {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}
app.post("/login", passport.authenticate("local", { session: true }), function (req,res){
  res.status(200).json({ user: getUserPreview(req.user) });
});
app.get("/logout", function (req, res) {
  req.logout();
  res.status(200).json({ user: req.user });
});

app.post("/register", async (req, res) => {
  const userExists = await userModel.findOne({ email: req.body.email });
  if (userExists) {
    res.status(400).send({ message: "user with that email exists" });
  } else {
    try {
      const newUser = new userModel(req.body);
      try {
        await newUser.save();
        res.status(200).send({ id: newUser._id, email: newUser.email });
      } catch (error) {
        res.status(500).send({ status: error });
      }
    } catch (e) {
      res.status(500).json({ status: e._message });
    }
  }
});
module.exports = app;
