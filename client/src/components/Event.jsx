import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { getSchool, getUser } from "../store/actions";
import api from "../services/api";

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolId: "",
      xpAmount: 0,
      arrayOfNames: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { auth } = this.props;

    const { getSchool } = this.props;

    getSchool(auth.user.school);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.props.xpIncrease(this.state.userId, {
    //   xpIncrease: parseInt(this.state.xpAmount, 10),
    // });
    this.props.getSchool(this.state.schoolId);
  }

  render() {
    const { currentSchool } = this.props;

    const studentNames =
      currentSchool &&
      currentSchool.students.map((student) => {
        return <div>--{student.username}</div>;
      });
    // const students = currentSchool.students.map((student) => {
    //   console.log(student);
    //   //   const { username } = api.call("get", `users/${student}`);
    //   //   const usernameStudent = username;
    //   //   return <h1>{usernameStudent}</h1>;
    // });

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="schoolId">schoolId</label>
          <input
            type="text"
            name="schoolId"
            value={this.state.schoolId}
            onChange={this.handleChange}
          />

          {/* <label htmlFor="xpAmount">xpAmount</label>
        <input
          type="text"
          name="xpAmount"
          value={this.state.xpAmount}
          onChange={this.handleChange}
        /> */}

          <button type="submit">Submit</button>
        </form>
        <h1>Your school is {currentSchool.name}</h1>
        <h1>
          {currentSchool.name}'s total points: {currentSchool.points}
        </h1>
        <h1>
          Students apart of {currentSchool.name}: {studentNames}
        </h1>
        {/* {username} */}
      </div>
    );
  }
}

export default connect(
  (store) => ({
    currentSchool: store.currentSchool,
    auth: store.auth,
  }),
  { getSchool, getUser }
)(Event);
