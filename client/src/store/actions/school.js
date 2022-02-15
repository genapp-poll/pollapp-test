import api from "../../services/api";
import {
  SET_POLLS,
  SET_CURRENT_POLL,
  SET_CURRENT_USER_SCHOOL,
} from "../actionTypes";
import { addError, removeError } from "./error";

// export const setPolls = (polls) => ({
//   type: SET_POLLS,
//   polls,
// });

export const setCurrentUserSchool = (school) => ({
  type: SET_CURRENT_USER_SCHOOL,
  school,
});

export const getSchool = (path) => {
  return async (dispatch) => {
    try {
      const school = await api.call("get", `schools/${path}`);
      console.log(school);
      dispatch(setCurrentUserSchool(school));
      dispatch(removeError());
    } catch (err) {
      const { error } = err.response.data;
      dispatch(addError(error.message));
    }
  };
};

// export const getPolls = () => {
//   return async (dispatch) => {
//     try {
//       const polls = await api.call("get", "polls");
//       dispatch(setPolls(polls));
//       dispatch(removeError());
//     } catch (err) {
//       const error = err.response.data;
//       dispatch(addError(error.message));
//     }
//   };
// };

// export const getUserPolls = () => {
//   return async (dispatch) => {
//     try {
//       const polls = await api.call("get", "polls/user");
//       console.log(`hi${polls}`);
//       dispatch(setPolls(polls));
//       dispatch(removeError());
//     } catch (err) {
//       const error = err.response.data;
//       dispatch(addError(error.message));
//     }
//   };
// };

// export const createPoll = (data) => {
//   return async (dispatch) => {
//     try {
//       const poll = await api.call("post", "polls", data);
//       dispatch(setCurrentPoll(poll));
//       dispatch(removeError());
//     } catch (err) {
//       const error = err.response.data;
//       dispatch(addError(error.message));
//     }
//   };
// };

// export const vote = (path, data) => {
//   return async (dispatch) => {
//     try {
//       const poll = await api.call("post", `polls/${path}`, data);
//       const polls = await api.call("get", "polls");
//       dispatch(setPolls(polls));
//       dispatch(setCurrentPoll(poll));
//       dispatch(removeError());
//     } catch (err) {
//       const error = err.response.data;
//       dispatch(addError(error.message));
//     }
//   };
// };
