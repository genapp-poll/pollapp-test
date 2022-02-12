import React, { Fragment } from "react";
import { connect } from "react-redux";

const ErrorMessage = ({ error }) => (
  <Fragment>{error && <div>{error.message}</div>}</Fragment>
  //checking if error exists, if yes, then show error message
);

export default connect((store) => ({ error: store.error }))(ErrorMessage);
