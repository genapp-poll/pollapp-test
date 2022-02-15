import { combineReducers } from "redux";

import auth from "./auth";
import error from "./error";
import { polls, currentPoll } from "./polls";
import { currentSchool } from "./school";

export default combineReducers({
  auth,
  error,
  polls,
  currentPoll,
  currentSchool,
});
