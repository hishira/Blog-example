const express = require("express");
const commentModel = require("../models/Comment");
const postModel = require("../models/Post");
const userModel = require("../models/User");
const app = express();
const checkIfAdmin = require("../middleware/ifadmin");
const checkIfLogin = require("../middleware/logedin");

app.get("/comments", checkIfAdmin, async (req, res) => {
  try {
    const comments = await commentModel.find({});
    try {
      res.status(200).json(comments);
    } catch (err) {
      res.status(404).json({ message: "Error with geting comments" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
/*
    Create comment to blog post
*/
app.post("/annonymousCommment", async (req, res) => {
  try {
    const post = await postModel.findById(req.body.postID);
    if (!post) {
      return res.status(404).json({ message: "Post do not exists" });
    } else {
      try {
        console.log(req.body)
        const newComment = new commentModel({
          content: req.body.content,
          post: req.body.postID,
        });
        await newComment.save();
        post.comments.push(newComment);
        await post.save();
        return res.status(200).json(newComment);
      } catch (err) {
        return res.status(404).json({ message: "Error with post adding" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Problem with post finding" }).end();
  }
});
app.post("/comment", checkIfLogin, async (req, res) => {
  try {
    const post = await postModel.findById(req.body.postID);
    if (!post) {
      return res.status(404).json({ message: "Post do not exists" }).end();
    } else {
      try {
        const newComment = new commentModel({
          content: req.body.content,
          post: req.body.postID,
          user: req.user._id,
        });
        try {
          await newComment.save();
          const user = await userModel.findById(req.user._id);
          user.comments.push(newComment);
          await user.save();
          post.comments.push(newComment);
          await post.save();
          return res.status(200).json(newComment);
        } catch (err) {
          return res.status(404).json({ message: "Error with post adding" });
        }
      } catch (err) {
        return res.status(500).json({ message: "Server error" });
      }
    }
  } catch (err) {
    return res.status(404).json({ message: "Problem with post finding" }).end();
  }
});
app.post("/commentforpost", async (req, res) => {
  try {
    console.log(req.body);
    const comments = await commentModel.find({ post: req.body.postID });
    let arr = [];
    for (let i of comments) {
      let k = await i.populate("user").execPopulate();
      arr.push(k);
    }
    const commentswithuser = arr;
    return res.status(200).json(commentswithuser).end();
  } catch (err) {
    return res.status(500).send("Problem").end();
  }
});
app.delete("/comment/:id", checkIfLogin, async (req, res) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    }
    const user = await userModel.findById(req.user._id);
    user.comments.remove(req.params.id);
    await user.save();
    const post = await postModel.findById(comment.post);
    post.comments.remove(req.params.id);
    await post.save();
    res.status(200).json({ messagge: "OK" }).end();
  } catch (err) {
    res.status(500).json({ message: "Problem with comment deleting" }).end();
  }
});
app.put("/comment/:id", checkIfLogin, async (req, res) => {
  try {
    await commentModel.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
        editingDate: Date.now(),
      },
      (err, model) => {
        if (err) {
          return res
            .status(404)
            .json({ message: "Erorro with comment updating" });
        } else {
          if (model === null) {
            return res
              .status(404)
              .json({ message: "Erorro with comment updating" });
          }
          return res.status(200).json(model);
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = app;
