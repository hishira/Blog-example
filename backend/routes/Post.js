const express = require("express");
const postModel = require("../models/Post");
const userModel = require("../models/User");
const commentModel = require("../models/Comment")
const app = express();
const checkifAdmin = require("../middleware/ifadmin");
const checkifLogin = require("../middleware/logedin");

app.get("/posts", checkifAdmin, async (req, res) => {
  try {
    const posts = await postModel.find({});
    try {
      res.send(posts);
    } catch (err) {
      res.status(404).send(err);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
/*
  Return only public posts
*/
app.get("/publicposts", checkifLogin, async (req, res) => {
  try {
    const publicPosts = await postModel.find({ postType: "PUBLIC" });
    try {
      res.status(200).send(publicPosts);
    } catch (err) {
      res.status(404).send(err);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
/*
  Return all private post, for admin only
*/
app.get("/privateposts", checkifAdmin, async (req, res) => {
  try {
    const privateposts = await postModel.find({ postType: "PRIVATE" });
    try {
      res.status(200).send(privateposts).end();
    } catch (err) {
      res.status(404).send(err).end();
    }
  } catch (err) {
    res.status(500).send(err).end();
  }
});
/* 
  Return all, private and public user posts
*/
app.get("/userposts", checkifLogin, async (req, res) => {
  try {
    let userPosts = await postModel.find({ user: req.user._id });
    try {
      res.status(200).send(userPosts).end();
    } catch (err) {
      res.status(404).json(err).end();
    }
  } catch (err) {
    res.status(500).send(err).end();
  }
});
/*
  Return public post by id
*/
app.get("/publicuserpost/:id", async (req, res) => {
  try {
    let publicUserPosts = await postModel.findById(req.params.id)
    try{
        const postwithcomments = await publicUserPosts.populate('comments').execPopulate()
        res.status(200).json({post:postwithcomments,comments:postwithcomments})
    }catch (err) {
        res.status(404).json(err).end();
      }
    }catch(err){
        res.status(404).json(err).end()
    }
});
app.post("/post", checkifLogin, async (req, res) => {
  try {
    const newPost = new postModel({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
    });
    try {
      await newPost.save();
      const user = await userModel.findById(req.user._id);
      user.posts.push(newPost);
      await user.save();
      res.status(200).json(newPost);
    } catch (err) {
      res.status(500).send("Error with post adding");
    }
  } catch (err) {
    res.status(500).send("error");
  }
});

/*
  Edit post by id
*/
app.put("/post/:id",checkifLogin, async (req, res) => {
  try {
    postModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        editingDate: Date.now(),
      },
      {new:true},
      (err, model) => {
        if (err) {
          return res.status(404).json({ message: "Erorro with post updating" }).end();
        } 
        if(model === null)
          return res.status(404).json({ message: "Erorro with post updating" }).end();
        else {
          return res.status(200).json(model).end();
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err }).end();
  }
});

/* 
    Function that make post private
*/
app.put("/postprivate/:id", checkifLogin,async (req, res) => {
  try {
    await postModel.findByIdAndUpdate(
      req.params.id,
      {
        editingDate: Date.now(),
        postType: "PRIVATE",
      },{new:true},
      (err, model) => {
        if (!err) {
          res.status(200).json(model).end();
        } else {
          return res.status(404).send({error: err}).end();
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/* 
    Function that make post public
*/
app.put("/publicpost/:id",checkifLogin, async (req, res) => {
  
  try {
    await postModel.findByIdAndUpdate(
      req.params.id,
      {
        editingDate: Date.now(),
        postType: "PUBLIC",
      },{new:true},
      (err, model) => {
        if (err) {
          res.status(404).json({ message: "Error with editing post type" });
        } else {
          res.status(200).json(model);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
app.delete("/post/:id", checkifLogin, async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send("Not post found");
    }
    const user = await userModel.findById(req.user._id);
    user.posts.remove(req.params.id);
    for(let i in post.comments){
      await commentModel.findByIdAndDelete(post.comments[i])
      await user.comments.remove(post.comments[i])
    }
    await user.save()
    res.status(200).send("Ok");
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = app;
