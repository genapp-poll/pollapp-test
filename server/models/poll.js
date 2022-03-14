const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  option: String,
  votes: {
    type: Number,
    default: 0,
  },
  whoVoted: [{ type: String }],
});

const commentSchema = new mongoose.Schema({
  user: String,
  comment: String,
  likes: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const pollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  question: String,
  options: [optionSchema],
  comments: [commentSchema],
  // voted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  voted: [{ type: String }],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Poll", pollSchema);
