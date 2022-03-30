import React from "react";
import { connect } from "react-redux";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";

import { vote } from "../store/actions";
import auth from "../store/reducers/auth";

const color = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
};

const Poll = ({ poll, vote }) => {
  const { auth } = this.props;

  const answers =
    poll.options &&
    poll.options.map((option) => (
      <button
        onClick={() =>
          vote(poll._id, { answer: option.option, token: auth.user.token })
        }
        key={option._id}
      >
        {option.option}
      </button>
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

  console.log("data", data);

  return (
    <div>
      <h3>{poll.question}</h3>
      <div>{answers}</div>
      {poll.options && <Pie data={data} />}
    </div>
  );
};

export default connect(
  (store) => ({
    poll: store.currentPoll,
    auth: store.auth,
  }),
  { vote }
)(Poll);
