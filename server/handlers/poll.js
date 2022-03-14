const db = require("../models");

exports.showPolls = async (req, res, next) => {
  try {
    const polls = await db.Poll.find().populate("user", ["username", "id"]);

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

    if (answer) {
      const poll = await db.Poll.findById(pollId);

      if (!poll) throw new Error("No poll found");

      const vote = poll.options.map((option) => {
        if (option.option === answer) {
          return {
            option: option.option,
            _id: option._id,
            votes: option.votes + 1,
            whoVoted: option.whoVoted.concat(token),
          };
        } else {
          return option;
        }
      });

      if (poll.voted.filter((user) => user.toString() === token).length <= 0) {
        poll.voted.push(token);
        poll.options = vote;

        await poll.save();

        res.status(202).json(poll);
      } else {
        throw new Error("Already voted");
      }
    } else {
      throw new Error("No answer provided");
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
    const { comment, token } = req.body;
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

      poll.comments.push({ user: token, comment: comment });

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
