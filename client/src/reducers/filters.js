import { SET_VOTE_FILTER } from "../actions/types";

export default (state = { vote: false }, action) => {
  switch (action.type) {
    case SET_VOTE_FILTER:
      return {
        ...state,
        vote: action.payload
      };
    default:
      return state;
  }
};
