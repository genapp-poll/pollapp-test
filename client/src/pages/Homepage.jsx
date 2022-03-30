import React, { useEffect } from "react";
import { connect } from "react-redux";
import Polls from "../components/Polls";
import Comments from "../components/Comments";
import ErrorMessage from "../components/ErrorMessage";
import { getLeaderBoard } from "../store/actions";

const HomePage = (props) => {
  useEffect(() => {
    props.getLeaderBoard();
  }, [])

  return (
    <div>
      <ErrorMessage />
      <Polls {...props} />
      <Comments {...props} />
    </div>
  );
}

export default connect(null, {getLeaderBoard})(HomePage);
