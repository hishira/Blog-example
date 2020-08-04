const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createDate: {
    type: Date,
    default: Date.now(),
  },
  editingDate: {
    type: Date,
    default: Date.now(),
  },
  postType: {
    type: String,
    required: true,
    enum: ["PUBLIC", "PRIVATE"],
    default: "PUBLIC",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    },
  ],
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
