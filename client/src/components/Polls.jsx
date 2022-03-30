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
    await vote(poll._id, { answer: option.option, token: auth.user.token });
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
      // if (option.option == highestOption) {
      //   this.props.xpIncrease(auth.user.id, {
      //     xpIncrease: parseInt(10, 10),
      //   });
      // }
    }
  }

  render() {
    const { auth, getPolls, getUserPoll, vote, getCurrentPoll } = this.props;

    const polls = this.props.polls.map((poll) => {
      const {voted=[]} = poll;
      const answers =
        poll.options &&
        poll.options.filter((o) => o.option).map((option) => (
          <div key={option.option}>
            <button
              onClick={() => this.voteFunction(vote, poll, option, auth)}
              key={option._id}
            >
              {option.option}
            </button>
          </div>
        ));
      if (voted.some((v) => v.token === auth.user.token)) {
        var show = true;
        var data = poll.options && {
          labels: poll.options.filter((o) => o.option).map((option) => option.option),
          datasets: [
            {
              label: poll.question,
              backgroundColor: poll.options.map((option) => color()),
              borderColor: "#323643",
              data: poll.options.map((option) => option.votes),
            },
          ],
        };
      } else {
        console.log("nope");
      }

      // console.log("data", voted, poll.options);

      const decide = poll.options.map((option) => {
        const {whoVoted=[]} = option;
        if (whoVoted.includes(auth.user.token)) {
          return (
            <p key={option.option}>
              {auth.user.token} voted for {option.option}
            </p>
          );
        }
      });

      // if (poll.voted.includes(auth.user.token)) {
      //   this.setState({ show: true });
      // } else {
      //   // this.setState({ show: false });
      // }

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
          {decide}
          <h1>{voted.length * 50 + 36}</h1>
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
            {poll.options && show && <Pie data={data} />}
          </div>
        </div>
      );
    });

    return (
      <Fragment>
        {/* {auth.isAuthenticated && (
          <div>
            <button onClick={getPolls}>All polls</button>
            <button onClick={getUserPolls}>My polls</button>
          </div>
        )} */}

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
