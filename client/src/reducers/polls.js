/*eslint-disable*/
import { SET_POLLS, ADD_POLL, EDIT_POLL } from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case SET_POLLS:
      return action.payload;
    case ADD_POLL:
      return [...state, action.payload];
    case EDIT_POLL:
      return state.map(poll => {
        if (poll._id === action.id) {
          return {
            ...poll,
            ...action.updates
          };
        }
      });
    default:
      return state;
  }
};
