const express = require("express");
const userModel = require("../models/User");
const app = express();
const passport = require("passport");
const checkifAdmin = require("../middleware/ifadmin");
const checkIfLogin = require("../middleware/logedin");
const User = require("../models/User");
app.get("/users", checkifAdmin, async (req, res) => {
  try {
    const users = await userModel.find({}).catch((err) => {
      res.status(404).send("Database error");
    });
    try {
      res.status(200).send(users).end();
    } catch (err) {
      res.status(400).send(err).end();
    }
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});
app.get("/userinfo", checkIfLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await user.populate("posts").execPopulate();
    try {
      return res
        .status(200)
        .json({
          email: user.email,
          username: user.username,
          role: user.role,
          description: user.description,
          posts: user.posts,
          comments: user.comments,
          watched: user.watched,
          _id:user._id
        })
        .end();
    } catch (err) {
      return res.status(400).json(err).end();
    }
  } catch (err) {
    return res.status(500).json(err).end();
  }
});
app.delete("/user/:id", checkifAdmin, async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send("Not user found");
    }
    res.status(200).send("OK");
  } catch (err) {
    res.status(500).send(err);
  }
});
/*
    change user role to admin
*/
app.put("/rolechange/:id", checkifAdmin, async (req, res) => {
  try {
    userModel.findOneAndUpdate(
      { _id: req.params.id },
      { role: "ADMIN" },
      { new: true },
      (err, model) => {
        if (err) {
          return res
            .status(404)
            .json({ message: "Erorro with user role updating" });
        } else {
          if (model === null)
            return res.status(404).json({ message: "No user" });
          return res.status(200).json(model);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
/**
 * Email change
 */
app.put("/emailchange", checkIfLogin, async (req, res) => {
  try {
    let userExists = await userModel.findOne({ email: req.body.email });
    if (userExists)
      return res.status(404).json({ message: "Email is already taken" });
    userModel.findByIdAndUpdate(
      req.user._id,
      {
        email: req.body.email,
      },
      (err, model) => {
        if (err) {
          res.status(404).json({ message: "Erorro with user role updating" });
        } else {
          res.status(200).json({ obj: model });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
app.put("/descriptionchange", checkIfLogin, async (req, res) => {
  try {
    userModel.findByIdAndUpdate(
      req.user._id,
      { description: req.body.description },
      { new: true },
      (err, model) => {
        if (err) {
          return res.status(404).json({ message: "Problem" });
        } else if (model === null) {
          return res.status(404).json({ message: "Problem" });
        }
        return res.status(200).json(model);
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});
app.put("/passwordchange", checkIfLogin, async (req, res) => {
  try {
    userModel.findOne({ _id: req.user._id }, (err, user) => {
      if (err) {
        return res.status(404).send("Password change problem");
      }
      user.password = req.body.password;
      user.save();
      res.status(200).send("Ok");
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});
app.post("/userfind", async (req, res) => {
  try {
    let users = await userModel.find({
      username: { $regex: req.body.username, $options: "i" },
    });
    res.status(200).json(users).end();
  } catch (err) {
    res.status(500).json(err).end();
  }
});
app.get("/userpublicprofile/:id", async (req, res) => {
  try {
    let user = await userModel.findById(req.params.id);
    await user.populate({path:"posts",match:{ postType:"PUBLIC"}}).execPopulate()
    if (!user) return res.status(404).send("UserNotFound").end();
    return res.status(200).json(user).end();
  } catch (err) {
    return res.status(500).send("Server erroor");
  }
});
module.exports = app;
