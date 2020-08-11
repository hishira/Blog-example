const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
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
      default: Date.now()
  },
  post:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Post"
  },
  user:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
  }
});
const Comment = mongoose.model("Comment",commentSchema)
module.exports = Comment
