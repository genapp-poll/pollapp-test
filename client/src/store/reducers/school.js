import {
  SET_CURRENT_POLL,
  SET_CURRENT_USER_SCHOOL,
  SET_POLLS,
} from "../actionTypes";

// export const polls = (state = [], action) => {
//   switch (action.type) {
//     case SET_POLLS:
//       return action.polls;
//     default:
//       return state;
//   }
// };

export const currentSchool = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_USER_SCHOOL:
      return action.school;
    default:
      return state;
  }
};
