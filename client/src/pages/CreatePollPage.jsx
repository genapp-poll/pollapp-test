import React from "react";
import { Redirect } from "react-router";
import ErrorMessage from "../components/ErrorMessage";
import CreatePoll from "../components/CreatePoll";

const CreatePollPage = ({ isAuthenticated }) => {
  if (!isAuthenticated) return <Redirect to="login" />;

  return (
    <div>
      <ErrorMessage />
      <CreatePoll />
    </div>
  );
};

export default CreatePollPage;
