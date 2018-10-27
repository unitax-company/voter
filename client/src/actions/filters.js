import { SET_VOTE_FILTER } from "./types";

export const setFilter = filter => {
  return {
    type: SET_VOTE_FILTER,
    payload: filter
  };
};
