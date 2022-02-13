const jwt = require("jsonwebtoken");

const db = require("../models");

exports.register = async (req, res, next) => {
  try {
    const user = db.User.create(req.body);
    const { id, username } = user;

    const token = jwt.sign({ id, username }, process.env.SECRET);

    res.status(200).json({ id, username, token });
    console.log(req.body);
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, that username is already taken";
    }

    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ username: req.body.username });

    const { id, username, xp, polls } = user;
    const valid = await user.comparePassword(req.body.password);

    if (valid) {
      const token = jwt.sign({ id, username, xp, polls }, process.env.SECRET);

      res.json({ id, username, xp, token, polls });
    } else {
      throw new Error();
    }
  } catch (err) {
    err.message = "Invalid Username/Password";

    next(err);
  }
};
