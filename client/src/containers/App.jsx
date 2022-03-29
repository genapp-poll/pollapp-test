import React, { Fragment, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import decode from "jwt-decode";

import { store } from "../store/index";
import {
  setCurrentUser,
  addError,
  setToken,
  getUser,
  newTestUser,
} from "../store/actions";
import Auth from "../components/Auth";
import ErrorMessage from "../components/ErrorMessage";
import RouteViews from "./RouteViews";
import NavBar from "./NavBar";

// if (localStorage.jwtToken) {
//   setToken(localStorage.jwtToken);
//   try {
//     store.dispatch(setCurrentUser(decode(localStorage.jwtToken)));
//     store.dispatch(getUser(decode(localStorage.jwtToken).id));
//   } catch (err) {
//     store.dispatch(setCurrentUser({}));
//     store.dispatch(addError(err));
//   }
// }

if (localStorage.testToken) {
  store.dispatch(setCurrentUser({ token: localStorage.testToken }));
  setToken(localStorage.testToken);
} else {
  let random = Math.random().toString(36).substr(2); // remove `0.`
  let token = random + random;
  // console.log(random + random);
  store.dispatch(
    newTestUser("nothing", {
      token: token,
    })
  );
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
