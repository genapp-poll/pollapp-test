import React, { Fragment } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import decode from "jwt-decode";

import { store } from "../store/index";
import { setCurrentUser, addError, setToken } from "../store/actions";
import Auth from "../components/Auth";
import ErrorMessage from "../components/ErrorMessage";
import RouteViews from "./RouteViews";
import NavBar from "./NavBar";

if (localStorage.jwtToken) {
  setToken(localStorage.jwtToken);
  try {
    store.dispatch(setCurrentUser(decode(localStorage.jwtToken)));
  } catch (err) {
    store.dispatch(setCurrentUser({}));
    store.dispatch(addError(err));
  }
}

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        {/* <Auth authType={"login"} />
        <ErrorMessage /> */}
        <NavBar />
        <RouteViews />
      </Fragment>
    </Router>
  </Provider>
);

export default App;
