const postModel = require("../models/Post");
const userModel = require("../models/User");
const commentModel = require("../models/Comment");

class PostController {
  static async GetAllPosts(req, res) {
    try {
      const posts = await postModel.find({});
      try {
        return res.send(posts);
      } catch (err) {
        return res.status(404).send(err);
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  static async GetPublicPosts(req, res) {
    try {
      const publicPosts = await postModel.find({ postType: "PUBLIC" });
      try {
        return res.status(200).send(publicPosts);
      } catch (err) {
        return res.status(404).send(err);
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  static async GetPrivatePosts(req, res) {
    try {
      const privateposts = await postModel.find({ postType: "PRIVATE" });
      try {
        return res.status(200).send(privateposts).end();
      } catch (err) {
        return res.status(404).send(err).end();
      }
    } catch (err) {
      return res.status(500).send(err).end();
    }
  }
  static async GetUserPosts(req, res) {
    try {
      let userPosts = await postModel.find({ user: req.user._id });
      try {
        return res.status(200).send(userPosts).end();
      } catch (err) {
        return res.status(404).json(err).end();
      }
    } catch (err) {
      return res.status(500).send(err).end();
    }
  }
  static async GetPublicUserPosts(req, res) {
    try {
      let publicUserPosts = await postModel.findById(req.params.id);
      try {
        const postwithcomments = await publicUserPosts
          .populate("comments")
          .execPopulate();
        return res
          .status(200)
          .json({ post: postwithcomments, comments: postwithcomments });
      } catch (err) {
        return res.status(404).json(err).end();
      }
    } catch (err) {
      return res.status(404).json(err).end();
    }
  }
  static async Create(req, res) {
    try {
      const newPost = new postModel({
        title: req.body.title,
        content: req.body.content,
        user: req.user._id,
        postType: req.body.postPrivate ? "PRIVATE" : "PUBLIC",
        tags: req.body.tags,
      });
      try {
        await newPost.save();
        const user = await userModel.findById(req.user._id);
        user.posts.push(newPost);
        await user.save();
        return res.status(200).json(newPost);
      } catch (err) {
        return res.status(500).send("Error with post adding");
      }
    } catch (err) {
      return res.status(500).send("error");
    }
  }
  static async Update(req, res) {
    try {
      postModel.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          content: req.body.content,
          editingDate: Date.now(),
        },
        { new: true },
        (err, model) => {
          if (err) {
            return res
              .status(404)
              .json({ message: "Erorro with post updating" })
              .end();
          }
          if (model === null)
            return res
              .status(404)
              .json({ message: "Erorro with post updating" })
              .end();
          else {
            return res.status(200).json(model).end();
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err }).end();
    }
  }
  static async MakePrivate(req, res) {
    try {
      await postModel.findByIdAndUpdate(
        req.params.id,
        {
          editingDate: Date.now(),
          postType: "PRIVATE",
        },
        { new: true },
        (err, model) => {
          if (!err) {
            res.status(200).json(model).end();
          } else {
            return res.status(404).send({ error: err }).end();
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
  static async MakePublic(req, res) {
    try {
      await postModel.findByIdAndUpdate(
        req.params.id,
        {
          editingDate: Date.now(),
          postType: "PUBLIC",
        },
        { new: true },
        (err, model) => {
          if (err) {
            return res
              .status(404)
              .json({ message: "Error with editing post type" });
          } else {
            return res.status(200).json(model);
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
  static async Delete(req, res) {
    try {
      const post = await postModel.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).send("Not post found");
      }
      const user = await userModel.findById(req.user._id);
      user.posts.remove(req.params.id);
      for (let i in post.comments) {
        await commentModel.findByIdAndDelete(post.comments[i]);
        await user.comments.remove(post.comments[i]);
      }
      await user.save();
      return res.status(200).send("Ok");
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  static async Like(req, res) {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      } else {
        const user = await userModel.findById(req.user._id);
        if (post.likes.includes(user._id))
          return res.status(400).send("User like this post");
        post.likes.push(user);
        await post.save();
        return res.status(200).send("Ok");
      }
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
  static async RemoveLike(req, res) {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      } else {
        const user = await userModel.findById(req.user._id);
        if (!post.likes.includes(user._id))
          return res.status(400).send("User do not like this post");
        await post.likes.remove(user);
        await post.save();
        return res.status(200).send("Ok");
      }
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
  static async Sort(req, res) {
    try {
      const post = await postModel
        .find({ user: req.body.userID })
        .sort({
          createDate:
            req.body.sortOption === "date_descending"
              ? "descending"
              : "ascending",
        });
      return res.status(200).json(post).end();
    } catch (err) {
      return res.status(500).send("Server problem");
    }
  }
  static async UserPosts(req, res) {
    try {
      const posts = await postModel.find({ user: req.params.id });
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(505).send("Server error");
    }
  }
  static async SortByLikes(req, res) {
    try {
      const posts = await postModel
        .find({ user: req.body.userID })
        .sort({ likes: -1 });
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).send("server error");
    }
  }
  static async PostsByTag(req, res) {
    try {
      const posts = await postModel.find({
        tags: { $all: [req.body.username] },
      });
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).send("server error");
    }
  }
}
module.exports = PostController;
