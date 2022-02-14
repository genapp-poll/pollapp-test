import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  getPolls,
  getUserPolls,
  getCurrentPoll,
  vote,
  xpIncrease,
} from "../store/actions";
import auth from "../store/reducers/auth";

import "chart.js/auto";
import { Pie } from "react-chartjs-2";

const color = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
};

class Polls extends Component {
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.voteFunction = this.voteFunction.bind(this);
  }

  componentDidMount() {
    const { getPolls } = this.props;

    getPolls();
  }

  handleSelect(id) {
    const { history } = this.props;
    history.push(`/poll/${id}`);
  }

  //only if you vote in the major9ity, then ur xp increases
  async voteFunction(vote, poll, option, auth) {
    await vote(poll._id, { answer: option.option });
    if (this.props.error.message == "Already voted") {
      return;
    } else {
      let highestOption = "";
      let highestVote = -1;
      await poll.options.map((option) => {
        if (option.votes > highestVote) {
          highestVote = option.votes;
          highestOption = option.option;
        }
      });
      if (option.option == highestOption) {
        this.props.xpIncrease(auth.user.id, {
          xpIncrease: parseInt(10, 10),
        });
      }
    }
  }

  render() {
    const { auth, getPolls, getUserPoll, vote, getCurrentPoll } = this.props;

    const polls = this.props.polls.map((poll) => {
      const answers =
        poll.options &&
        poll.options.map((option) => (
          <div>
            <button
              onClick={() => this.voteFunction(vote, poll, option, auth)}
              key={option._id}
            >
              {option.option}
            </button>
          </div>
        ));

      const data = poll.options && {
        labels: poll.options.map((option) => option.option),
        datasets: [
          {
            label: poll.question,
            backgroundColor: poll.options.map((option) => color()),
            borderColor: "#323643",
            data: poll.options.map((option) => option.votes),
          },
        ],
      };

      return (
        <div
          // onClick={() => this.handleSelect(poll._id)}
          key={poll._id}
          style={{
            height: "400px",
            width: "300px",
            margin: "0 auto",
            textAlign: "center",
            borderColor: "blue",
            border: "solid",
          }}
        >
          {poll.question}
          <br></br>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {answers}
          </div>
          <div
            style={{
              width: "100%",
              height: "50px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {poll.options && <Pie data={data} />}
          </div>
        </div>
      );
    });

    return (
      <Fragment>
        {auth.isAuthenticated && (
          <div>
            <button onClick={getPolls}>All polls</button>
            <button onClick={getUserPolls}>My polls</button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {polls}
        </div>
      </Fragment>
    );
  }
}

export default connect(
  (store) => ({
    auth: store.auth,
    polls: store.polls,
    pollCurrent: store.getCurrentPoll,
    error: store.error,
  }),
  { getPolls, getUserPolls, getCurrentPoll, vote, xpIncrease }
)(Polls);
