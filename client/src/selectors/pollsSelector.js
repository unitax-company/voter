import { createSelector } from "reselect";

const getPolls = state => state.polls;
const getFilters = state => state.filters;
const getUser = state => state.auth.user;

const getVisiblePolls = createSelector(
  [getPolls, getFilters, getUser],
  (polls, filters, user) => {
    if (!polls.length) return polls;
    if (filters.vote) {
      let votedPolls = [];
      polls.forEach(poll => {
        outer: for (let i = 0; i < poll.answers.length; i++) {
          let answer = poll.answers[i];
          for (let j = 0; j < answer.voted.length; j++) {
            let vote = answer.voted[j];
            if (vote.toString() === user.id) {
              votedPolls.push(poll);
              break outer;
            }
          }
        }
      });
      return votedPolls;
    } else {
      let notvotedPolls = [];
      polls.forEach(poll => {
        let find = false;
        outer: for (let i = 0; i < poll.answers.length; i++) {
          let answer = poll.answers[i];
          for (let j = 0; j < answer.voted.length; j++) {
            let vote = answer.voted[j];
            if (vote.toString() === user.id) {
              find = true;
              break outer;
            }
          }
        }

        if (!find) {
          notvotedPolls.push(poll);
        }
      });
      return notvotedPolls;
    }
  }
);

export default getVisiblePolls;
