import React, { useEffect } from "react";
import { connect } from "react-redux";
import Polls from "../components/Polls";
import Comments from "../components/Comments";
import ErrorMessage from "../components/ErrorMessage";

const HomePage = (props) => {
  return (
    <div>
      <ErrorMessage />
      <Polls {...props} />
      <Comments {...props} />
    </div>
  );
}

export default connect()(HomePage);
