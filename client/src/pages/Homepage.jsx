import React, { useEffect } from "react";
import { connect } from "react-redux";
import Polls from "../components/Polls";
import Comments from "../components/Comments";
import ErrorMessage from "../components/ErrorMessage";

const HomePage = (props) => {
  return (
    <div>
      <ErrorMessage />
      <div style={{display: "flex", alignItems: "flex-start"}}>
        <Polls {...props} />
        <Comments {...props} />
      </div>
    </div>
  );
}

export default connect()(HomePage);
