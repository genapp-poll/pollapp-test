import React from "react";
import Polls from "../components/Polls";
import Comments from "../components/Comments";
import ErrorMessage from "../components/ErrorMessage";

const HomePage = (props) => (
  <div>
    <ErrorMessage />
    <Polls {...props} />
    <Comments {...props} />
  </div>
);

export default HomePage;
