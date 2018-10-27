import axios from "axios";

import { SET_POLLS, ADD_POLL, EDIT_POLL, GET_ERRORS } from "./types";

export const getPolls = () => dispatch => {
  axios
    .get("polls")
    .then(res => {
      dispatch({
        type: SET_POLLS,
        payload: res.data
      });
    })
    .catch(err => global.console.log(err));
};

export const addPollQuestion = question => dispatch => {
  return axios
    .post("polls/new", question)
    .then(res => {
      dispatch({
        type: ADD_POLL,
        payload: res.data
      });
      return res.data;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const editPollQuestion = ({ question, id }) => dispatch => {
  return axios
    .patch(`polls/${id}`, { question })
    .then(({ data }) => {
      dispatch({
        type: EDIT_POLL,
        id,
        updates: { question: data.question }
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getPollById = id => () => {
  return axios
    .get(`polls/${id}`)
    .then(res => {
      return res.data;
    })
    .catch(err => global.console.log(err));
};
