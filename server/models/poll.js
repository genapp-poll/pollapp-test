const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  option: String,
  votes: {
    type: Number,
    default: 0,
  },
  whoVoted: [{ type: String }],
}, {timestamps: true});

const likeSchema = new mongoose.Schema({
  users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  total: {
    type: Number,
    default: 0
  }
});

const commentSchema = new mongoose.Schema({
  user: String,
  comment: String,
  parent_comment: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  reply_to: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  likes: { // i'd recommend likes to be its own schema which include users 
    type: Number,
    default: 0,
  },
  user_likes: likeSchema,
  created: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

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
}, {timestamps: true});

module.exports = mongoose.model("Poll", pollSchema);
