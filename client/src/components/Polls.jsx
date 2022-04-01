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
import { Tooltip } from "./common/Tooltip";
import { FaCrown } from "react-icons/fa";

const color = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
};

class Polls extends Component {
  state = {points_gained: 0, option: "", show_tooltip: false};

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
    const points_gained = await vote(poll._id, { answer: option.option, token: auth.user.token });
    if (this.props.error.message == "Already voted") {
      return;
    } else {
      this.setState({points_gained, option: option.option, show_tooltip: true}, () => {
        setTimeout(() => this.setState({show_tooltip: false}), 2000);
      });
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
    const {show_tooltip, option: choosen_option} = this.state;

    const polls = this.props.polls.map((poll) => {
      const {voted=[], options=[]} = poll;
      const hasVoted = voted.find((u) => u.user.token === auth.user.token);
      const popular_option = options.reduce((prev, curr, i) => {
        if(prev && (prev.votes >= curr.votes)){
            return prev;
        }
        return curr;
      });
      const answers =
        options &&
        options.filter((o) => o.option).map((option) => {
          const isVotedOption = option.whoVoted.some((u) => u.token === auth.user.token);
          return (
          <div key={option.option} style={{position: "relative"}}>
            <Tooltip show={(show_tooltip && choosen_option === option.option)} text={`You Gained ${this.state.points_gained} for voting`}>
              You Gained ${this.state.points_gained} for voting
            </Tooltip>
            {hasVoted && popular_option === option && <div title="winning"><FaCrown color="darkorange" size={20} /></div>}
            <button
              onClick={() => this.voteFunction(vote, poll, option, auth)}
              key={option._id}
              disabled={!!hasVoted}
              style={{border: "2px solid", margin: "5px 10px", borderColor: isVotedOption?"green":"transparent", borderRadius: 3}}
              >
              {option.option}
            </button>
          </div>
        )});
      if (voted.some((v) => v.user.token === auth.user.token)) {
        var show = true;
        var data = options && {
          labels: options.filter((o) => o.option).map((option) => option.option),
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

      const decide = options.map((option) => {
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

      const points_gained = hasVoted?.points_gained || 0;

      return (
        <div
          // onClick={() => this.handleSelect(poll._id)}
          key={poll._id}
          style={{
            // height: "400px",
            width: "300px",
            margin: "0 auto",
            textAlign: "center",
            border: "solid",
            borderColor: "blue",
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
              alignItems: "flex-end"
            }}
          >
            {answers}
          </div>
          <div
            style={{
              width: "100%",
              // height: "50px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {poll.options && show && <Pie data={data} />}
          </div>
          <p>You gained {points_gained} from this poll</p>
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
          <center><h1>Poll</h1></center>
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
