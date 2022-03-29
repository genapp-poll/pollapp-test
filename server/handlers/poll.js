const mongoose = require("mongoose");
const db = require("../models");

exports.showPolls = async (req, res, next) => {
  try {
    const polls = await db.Poll.find({open: true}).populate("user", ["username", "id"]).populate("comments.user_likes.users");

    res.status(200).json(polls);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.usersPolls = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    const user = await db.User.findById(id).populate("polls");
    //by default, each poll was only showing id,
    // using .populate, now each poll from the userdb is now populated with data from the polls db

    res.status(200).json(user.polls);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.createPoll = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const user = await db.User.findById(id);

    const { question, options } = req.body;
    const poll = await db.Poll.create({
      question,
      user,
      options: options.map((option) => ({ option, votes: 0 })),
    });
    user.polls.push(poll._id);
    await user.save();

    res.status(201).json({ ...poll._doc, user: user._id });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.getPoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    //req.paramas takes from the parameter of the route that was passed in

    const poll = await db.Poll.findById(id).populate("user", [
      "username",
      "id",
    ]);
    //arguments after populate specify specicify arguments we want in the population

    if (!poll) throw new Error("No poll found");

    res.status(200).json(poll);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.deletePoll = async (req, res, next) => {
  try {
    const { id: pollId } = req.params;
    const { id: userId } = req.decoded;
    //since there are two variables with same name, variable destructring allows to set differnet names for varaible : right side is current var name, left is pulling in name

    const poll = await db.Poll.findById(pollId);

    if (!poll) throw new Error("No poll found");
    if (poll.user.toString() !== userId) {
      throw new Error("Unauthorized access");
    }

    await poll.remove();
    res.status(202).json(poll);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.vote = async (req, res, next) => {
  // const { answer, token } = req.body;
  console.log("HELLO");
  // console.log(answer, token);
  try {
    
    const { id: pollId } = req.params;
    const { answer, token } = req.body;
    // console.log(token);
    
    const user = token && await db.User.findOne({token});
    
    if (answer && token && user) {
      const poll = await db.Poll.findById(pollId);
      
      if (!poll) throw new Error("No poll found");
      
      const current_date = Date.now();

      const vote = poll.options.map((option) => {
        if (option.option === answer) {
          return {
            option: option.option,
            _id: option._id,
            votes: option.votes + 1,
            whoVoted: option.whoVoted.push(new mongoose.Types.ObjectId(user._id)),
          };
        } else {
          return option;
        }
      });

      if (poll.voted.filter((u) => u.toString() === user._id).length <= 0) {
        poll.voted.push(new mongoose.Types.ObjectId(user._id));
        poll.options = vote;

        await poll.save();

        res.status(202).json(poll);
      } else {
        throw new Error("Already voted");
      }
    } else {
      throw new Error(!answer?"No answer provided":!token?"Not authenticated":"User not found");
    }
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.comment = async (req, res, next) => {
  // const { answer, token } = req.body;
  // console.log(answer, token);
  try {
    const { id: pollId } = req.params;
    const { comment, token, parent_comment=null, reply_to=null } = req.body;
    // console.log(token);

    if (comment) {
      const poll = await db.Poll.findById(pollId);

      if (!poll) throw new Error("No poll found");

      // const vote = poll.options.map((option) => {
      //   if (option.option === answer) {
      //     return {
      //       option: option.option,
      //       _id: option._id,
      //       votes: option.votes + 1,
      //       whoVoted: option.whoVoted.concat(token),
      //     };
      //   } else {
      //     return option;
      //   }
      // });

      poll.comments.push({ user: token, comment: comment, parent_comment, reply_to, user_likes: {user: [], total: 0}});

      await poll.save();

      res.status(202).json(poll);
    } else {
      throw new Error("No comment proviided");
    }
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.like_comment = async (req, res, next) => {
  try{
    const {poll_id, comment_id} = req.params;
    const {token} = req.body;
    // const {id: userId} = req.decoded;

    const user = token && await db.User.findOne({token});

    if(token && user){
      const poll = await db.Poll.findById(poll_id);
      if (!poll) throw new Error("No poll found");

      const comment_index = poll.comments.findIndex((c) => c._id.toString() === comment_id);
      if(comment_index === -1) throw new Error("Comment not found");

      poll.comments[comment_index].user_likes = poll.comments[comment_index].user_likes || {users: [], total: 0};
      poll.comments[comment_index].user_likes.users = poll.comments[comment_index].user_likes.users || [];

      const liked_index = poll.comments[comment_index].user_likes.users.findIndex((u) => u.toString() === user._id.toString());
      const is_already_liked = liked_index !== -1;

      const userLikes = poll.comments[comment_index].user_likes;

      if(is_already_liked){
        userLikes.users.splice(liked_index, 1);
        userLikes.total = userLikes.users.length;
        poll.comments[comment_index].likes -= 1;
      }else{
        userLikes.users.push(new mongoose.Types.ObjectId(user._id));
        userLikes.total += userLikes.users.length;
        poll.comments[comment_index].likes += 1;
      }

      await poll.save();
      await poll.populate("comments.user_likes.users");

      res.status(202).json(poll);
    }else{
      throw new Error("You need to be authenticated to like a comment");
    }
  }catch(e){
    e.staus = 400;
    next(e);
  }
}
