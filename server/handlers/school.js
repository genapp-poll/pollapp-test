const db = require("../models");

exports.showAllSchools = async (req, res, next) => {
  try {
    const schools = await db.School.find();

    res.status(200).json(schools);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.getSchool = async (req, res, next) => {
  try {
    const { id } = req.params;

    const school = await db.School.findById(id);

    if (!school) throw new Error("No school found");

    res.status(200).json(school);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateSchool = async (req, res, next) => {
  try {
    const { id: schoolId } = req.params;
    const { id: userId } = req.decoded;
    const { increasePoints, student } = req.body;

    const school = await db.School.findById(schoolId);
    if (!school) throw new Error("No school found");

    if (!student) {
      // do the points function
      school.points = school.points + increasePoints;
      await school.save();

      res.status(202).json(school);
    } else if (!increasePoints) {
      //do student function
      if (
        school.students.filter((user) => user.toString() === student).length <=
        0
      ) {
        school.students.push(student);
        await school.save();

        res.status(202).json(school);
      } else {
        throw new Error("Student is already apart of this school");
      }
    } else {
      throw new Error(
        "nothing is passed or trying to update both points and students at the same time"
      );
    }
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
