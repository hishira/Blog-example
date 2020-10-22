const commentModel = require("../models/Comment");
const postModel = require("../models/Post");
const userModel = require("../models/User");

class CommentController {
  static async GetComments(req, res) {
    try {
      const comments = await commentModel.find({});
      try {
        return res.status(200).json(comments);
      } catch (err) {
        return res.status(404).json({ message: "Error with geting comments" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }
  static async CreateAnonymousComment(req, res) {
    try {
      const post = await postModel.findById(req.body.postID);
      if (!post) {
        return res.status(404).json({ message: "Post do not exists" });
      } else {
        try {
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
      return res
        .status(500)
        .json({ message: "Problem with post finding" })
        .end();
    }
  }
  static async CreateComment(req, res) {
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
      return res
        .status(404)
        .json({ message: "Problem with post finding" })
        .end();
    }
  }
  static async GetCommentsByPost(req, res) {
    try {
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
  }
  static async Delete(req, res) {
    try {
      const comment = await commentModel.findByIdAndDelete(req.params.id);
      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
      }
      const user = await userModel.findById(req.body.userID);
      user.comments.remove(req.params.id);
      await user.save();
      const post = await postModel.findById(comment.post);
      post.comments.remove(req.params.id);
      await post.save();
      return res.status(200).json({ messagge: "OK" }).end();
    } catch (err) {
      return res.status(500).json({ message: "Problem with comment deleting" }).end();
    }
  }
  static async Update() {
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
  }
  static async Sort(req, res) {
    try {
      const comment = await commentModel.find({ post: req.body.postID }).sort({
        createDate:
          req.body.sortOption === "date_descending"
            ? "descending"
            : "ascending",
      });
      let arr = [];
      for (let i of comment) {
        let k = await i.populate("user").execPopulate();
        arr.push(k);
      }

      return res.status(200).json(arr);
    } catch (err) {
      return res.status(500).send("Server error").end();
    }
  }
  static async GetUserComments(req, res) {
    try {
      let userComments = await commentModel.find({ user: req.params.id });
      return res.status(200).json(userComments);
    } catch (err) {
      return res.status(505).send("Server error");
    }
  }
}
module.exports = CommentController;
