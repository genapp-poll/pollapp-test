require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/vote");

const db = require("./models");

const users = [
  { username: "username", password: "password" },
  { username: "kelvin", password: "password" },
];

const polls = [
  {
    question: "Which is the best JavaScript framework",
    options: ["Angular", "React", "VueJS"],
  },
  { question: "Who is the best mutant", options: ["Wolverine", "Deadpool"] },
  { question: "Truth or dare", options: ["Truth", "Dare"] },
  { question: "Boolean?", options: ["True", "False"] },
];

const schools = [
  { name: "Berkeley", points: 0, students: [] },
  { name: "Stanford", points: 0, students: [] },
];

const seed = async () => {
  try {
    await db.User.remove();
    console.log("DROP ALL USERS");

    await db.Poll.remove();
    console.log("DROP ALL POLLS");

    await Promise.all(
      users.map(async (user) => {
        const data = await db.User.create(user);
        await data.save();
      })
    );
    console.log("CREATED USERS", JSON.stringify(users));

    await Promise.all(
      polls.map(async (poll) => {
        poll.options = poll.options.map((option) => ({ option, votes: 0 }));
        const data = await db.Poll.create(poll);
        const user = await db.User.findOne({ username: "username" });
        data.user = user;
        user.polls.push(data._id);
        await user.save();
        await data.save();
      })
    );
    console.log("CREATED POLLS", JSON.stringify(polls));
  } catch (err) {
    console.error(err);
  }
};

const schoolSeed = async () => {
  try {
    await Promise.all(
      schools.map(async (school) => {
        const data = await db.School.create(school);
        await data.save();
      })
    );
    console.log("CREATED SCHOOLS", JSON.stringify(school));
  } catch (err) {
    console.error(err);
  }
};

// seed();
schoolSeed();
