import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  getPolls,
  getUserPolls,
  getCurrentPoll,
  vote,
  xpIncrease,
  comment,
} from "../store/actions";
import auth from "../store/reducers/auth";
import Comment from "./Comment";

const color = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
};

class Comments extends Component {
  state={newComment: ""};
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

  onChangeComment = (e) => {
    this.setState({newComment: e.target.value});
  }

  onPressComment = async (poll) => {
    const {newComment} = this.state;
    const {user: {token}} = this.props.auth;
    if(token){
      if(await this.props.comment(poll._id, {comment: newComment, token, parent_comment: null, reply_to: null})){
        this.setState({newComment: ""})
      }
    }
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
    const { auth, getPolls, getUserPoll, vote, getCurrentPoll, polls=[] } = this.props;
    const {newComment} = this.state;

    const Polls = polls.map((poll) => {
      const {comments, options=[], voted=[], question} = poll;
      const answers =
        options &&
        options.map((option) => (
          <div>
            <button
              onClick={() => this.voteFunction(vote, poll, option, auth)}
              key={option._id}
            >
              {option.option}
            </button>
          </div>
        ));
      if (voted.includes(auth.user.token)) {
        var show = true;
        var data = options && {
          labels: options.map((option) => option.option),
          datasets: [
            {
              label: question,
              backgroundColor: options.map((option) => color()),
              borderColor: "#323643",
              data: options.map((option) => option.votes),
            },
          ],
        };
      } else {
        console.log("nope");
      }

      const parentComments = comments.filter((c) => !c.parent_comment);

      const Comments = parentComments.map((comment) => {
        const childComments = comments.filter((c) => c.parent_comment === comment._id);
        // console.log("childComments", childComments);
        return (
          <div>
            <Comment comment={comment} key={comment._id} poll={poll} />
            <ul style={{paddingLeft: 20}} className="child-comments">
              {childComments.map((c) => <li><Comment comment={c} key={c._id} poll={poll} child /></li>)}
            </ul>
          </div>
        );
      });

      const decide = poll.options.map((option) => {
        if (option.whoVoted.includes(auth.user.token)) {
          return (
            <p>
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
          {Comments}
          <br></br>
          <div><textarea value={newComment} onChange={this.onChangeComment} /></div>
          <button onClick={() => this.onPressComment(poll)}>comment</button>
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
          {Polls}
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
  { getPolls, getUserPolls, getCurrentPoll, vote, xpIncrease, comment }
)(Comments);
