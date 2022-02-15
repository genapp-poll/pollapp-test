const db = require("../models");

exports.showAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.find();

    res.status(200).json(users);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    //req.paramas takes from the parameter of the route that was passed in

    const user = await db.User.findById(id);
    //arguments after populate specify specicify arguments we want in the population

    if (!user) throw new Error("No user found");

    res.status(200).json(user);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateXp = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { xpIncrease } = req.body;

    const user = await db.User.findById(userId);

    if (!user) throw new Error("No user found");
    user.xp = user.xp + xpIncrease;
    await user.save();
    const { id, username, xp, polls, school } = user;
    res.status(202).json({ id, username, xp, polls, school });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

//MAYBE LATER
// exports.deleteUser = async (req, res, next) => {
//   try {
//     const { id: pollId } = req.params;
//     const { id: userId } = req.decoded;
//     //since there are two variables with same name, variable destructring allows to set differnet names for varaible : right side is current var name, left is pulling in name

//     const poll = await db.Poll.findById(pollId);

//     if (!poll) throw new Error("No poll found");
//     if (poll.user.toString() !== userId) {
//       throw new Error("Unauthorized access");
//     }

//     await poll.remove();
//     res.status(202).json(poll);
//   } catch (err) {
//     err.status = 400;
//     next(err);
//   }
// };
