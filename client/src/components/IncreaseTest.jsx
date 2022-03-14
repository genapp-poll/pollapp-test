import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { xpIncrease, newTestUser } from "../store/actions";

class IncreaseTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      xpAmount: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.xpIncrease(this.state.userId, {
      xpIncrease: parseInt(this.state.xpAmount, 10),
    });
  }

  // rand() {
  //   if (localStorage.testToken) {
  //     console.log("nothing happens");
  //   } else {
  //     let random = Math.random().toString(36).substr(2); // remove `0.`
  //     let token = random + random;
  //     // console.log(random + random);
  //     this.props.newTestUser("nothing", token);
  //   }
  // }

  render() {
    // this.rand();
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="userId">UserId</label>
        <input
          type="text"
          name="userId"
          value={this.state.userId}
          onChange={this.handleChange}
        />

        <label htmlFor="xpAmount">xpAmount</label>
        <input
          type="text"
          name="xpAmount"
          value={this.state.xpAmount}
          onChange={this.handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default connect(() => ({}), { xpIncrease, newTestUser })(IncreaseTest);
