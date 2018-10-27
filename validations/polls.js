const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePollsInput(data) {
  let errors = {};

  data.question = !isEmpty(data.question) ? data.question : "";

  if (Validator.isEmpty(data.question)) {
    errors.question = "Question field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
