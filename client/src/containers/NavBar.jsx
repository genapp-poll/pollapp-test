import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../store/actions";
import { xpToLevel } from "../services/xpToLevel";

const NavBar = ({ auth, logout }) => (
  <div>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/test">Test</Link>
      </li>
      <li>
        <Link to="/event">Event</Link>
      </li>
      <li>{auth.isAuthenticated && <a onClick={logout}>Logout</a>}</li>
    </ul>
    {auth.isAuthenticated && <p>Logged in as {auth.user.username}</p>}
    {auth.isAuthenticated && <p>You have {auth.user.xp} xp</p>}
    {auth.isAuthenticated && <p>You are level {xpToLevel(auth.user.xp)}</p>}
  </div>
);

export default connect((store) => ({ auth: store.auth }), { logout })(NavBar);
