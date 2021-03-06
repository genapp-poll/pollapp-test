import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";

import { getCurrentPoll } from "../store/actions";

import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/Homepage";
import TestPage from "../pages/TestPage";
import PollPage from "../pages/PollPage";
import CreatePollPage from "../pages/CreatePollPage";
import EventPage from "../pages/EventPage";
import LeaderBoard from "../pages/LeaderBoard";

const RouteViews = ({ auth, getCurrentPoll }) => (
  <main>
    <Switch>
      <Route exact path="/" render={(props) => <HomePage {...props} />}></Route>
      <Route
        exact
        path="/login"
        render={() => (
          <AuthPage authType="login" isAuthenticated={auth.isAuthenticated} />
        )}
      />
      <Route
        exact
        path="/register"
        render={() => (
          <AuthPage
            authType="register"
            isAuthenticated={auth.isAuthenticated}
          />
        )}
      />
      <Route
        exact
        path="/poll/new"
        render={() => <CreatePollPage isAuthenticated={auth.isAuthenticated} />}
      />

      <Route
        exact
        path="/poll/:id"
        render={(props) => (
          <PollPage getPoll={(id) => getCurrentPoll(id)} {...props} />
        )}
      />

      <Route exact path="/test" render={() => <TestPage />} />
      <Route exact path="/event" render={() => <EventPage />} />
      <Route exact path="/leaderboard" component={LeaderBoard} />
    </Switch>
  </main>
);

export default withRouter(
  connect((store) => ({ auth: store.auth }), { getCurrentPoll })(RouteViews)
);
