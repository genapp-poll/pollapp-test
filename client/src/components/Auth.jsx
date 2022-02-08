import React from "react";
import { connect } from "react-redux";

import { authUser, logout } from "../store/actions";

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    //using bracket notation in setState, it allows you to use a variable name
    //this selects the name="username" in the input and set that as the target which is what you typed
  }

  handleSubmit(e) {
    const { username, password } = this.state;
    const { authType } = this.props;

    e.preventDefault();
    //prevents the default action of html to refresh to page after submit

    this.props.authUser(authType || "login", { username, password });
  }

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label for="username">username</label>
          <input
            type="text"
            value={username}
            name="username"
            onChange={this.handleChange}
          />

          <label for="password">password</label>
          <input
            type="password"
            value={password}
            name="password"
            onChange={this.handleChange}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

//connect allows you to connect to store } first param is passing into the store, second is functions that we are getting out of the store (actions)
export default connect(() => ({}), { authUser, logout })(Auth);
