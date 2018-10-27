const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAnswerInput(data, onlyExistFields = false) {
  let errors = {};

  if (!onlyExistFields) {
    data.answer = !isEmpty(data.answer) ? data.answer : "";

    if (Validator.isEmpty(data.answer)) {
      errors.answer = "Answer field is required";
    }

    if (data.order === undefined) {
      errors.order = "Order field is required";
    }
  } else {
    if (data.answer && Validator.isEmpty(data.answer)) {
      errors.answer = "Answer field is required";
    }
  }

  if (data.order !== undefined && isNaN(data.order)) {
    errors.order = "Order field must be a number";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
