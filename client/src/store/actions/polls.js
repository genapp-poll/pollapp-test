import api from "../../services/api";
import { SET_POLLS, SET_CURRENT_POLL, SET_LEADERBOARD } from "../actionTypes";
import { addError, removeError } from "./error";

export const setPolls = (polls) => ({
  type: SET_POLLS,
  polls,
});

export const setCurrentPoll = (poll) => ({
  type: SET_CURRENT_POLL,
  poll,
});

export const getPolls = () => {
  return async (dispatch) => {
    try {
      const polls = await api.call("get", "polls");
      const poll = polls[0]?.question || "NONE";
      console.log(`0index-${poll}`);
      dispatch(setPolls(polls));
      dispatch(removeError());
    } catch (err) {
      const error = err.response.data;
      dispatch(addError(error.message));
    }
  };
};

export const getUserPolls = () => {
  return async (dispatch) => {
    try {
      const polls = await api.call("get", "polls/user");
      console.log(`hi${polls}`);
      dispatch(setPolls(polls));
      dispatch(removeError());
    } catch (err) {
      const error = err.response.data;
      dispatch(addError(error.message));
    }
  };
};

export const getLeaderBoard = () => async (dispatch) => {
  try{
    const leader_board = await api.call("get", "polls/leaderboard");
    console.log("leader_board", leader_board);
    dispatch({type: SET_LEADERBOARD, payload: {leader_board}});
    dispatch(removeError());
  }catch(e){
    const error = e.response.data;
    dispatch(addError(error.message));
  }
}

export const createPoll = (data) => {
  return async (dispatch) => {
    try {
      const poll = await api.call("post", "polls", data);
      dispatch(setCurrentPoll(poll));
      dispatch(removeError());
    } catch (err) {
      const error = err.response.data;
      dispatch(addError(error.message));
    }
  };
};

export const getCurrentPoll = (path) => {
  return async (dispatch) => {
    try {
      const poll = await api.call("get", `polls/${path}`);
      dispatch(setCurrentPoll(poll));
      dispatch(removeError());
    } catch (err) {
      const { error } = err.response.data;
      dispatch(addError(error.message));
    }
  };
};

export const vote = (path, data) => {
  return async (dispatch) => {
    try {
      console.log(data);
      const poll = await api.call("post", `polls/${path}`, data);

      const polls = await api.call("get", "polls");
      dispatch(setPolls(polls));
      dispatch(setCurrentPoll(poll));
      dispatch(removeError());
    } catch (err) {
      const error = err.response.data;
      dispatch(addError(error.message));
    }
  };
};

export const comment = (path, data) => {
  return async (dispatch) => {
    try {
      const poll = await api.call("post", `polls/${path}/comments`, data);

      const polls = await api.call("get", "polls");
      dispatch(setPolls(polls));
      dispatch(setCurrentPoll(poll));
      dispatch(removeError());
      return true;
    } catch (err) {
      const error = err.response.data;
      dispatch(addError(error.message));
      return false;
    }
  };
};

export const like_comment = (poll_id, comment_id, data) => {
  return async (dispatch) => {
    try {
      const poll = await api.call("post", `polls/${poll_id}/${comment_id}/like`, data);

      const polls = await api.call("get", "polls");
      dispatch(setPolls(polls));
      dispatch(setCurrentPoll(poll));
      dispatch(removeError());
      return true;
    } catch (err) {
      const error = err.response.data;
      dispatch(addError(error.message));
      return false;
    }
  };
};
