const express = require("express");
const router = express.Router();
const Answer = require("../../models/Answers");
const Polls = require("../../models/Polls");
const passport = require("passport");

const validateAnswerInput = require("../../validations/answer");

router.get("/", (req, res) => {
  Answer.find()
    .then(polls => res.json(polls))
    .catch(err => res.status(404).json({ error: "No answers found" }));
});

router.post(
  "/:poll_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateAnswerInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Polls.findById(req.params.poll_id).then(poll => {
      console.log(req.body);
      const newAnswer = new Answer({
        answer: req.body.answer,
        order: req.body.order
      })
        .save()
        .then(answer => {
          poll.answers.push(answer);

          poll.save().then(poll => res.json(answer));
        });
    });
  }
);

router.patch(
  "/:answer_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateAnswerInput(req.body, true);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Answer.findOneAndUpdate(
      { _id: req.params.answer_id },
      { $set: req.body },
      { new: true }
    ).then(answer => res.json(answer));
  }
);

router.delete(
  "/:poll_id/:answer_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Answer.findOneAndRemove({ _id: req.params.answer_id }).then(answer => {
      if (answer) {
        Polls.findById(req.params.poll_id).then(poll => {
          poll.answers = poll.answers.filter(
            item => item.toString() !== req.params.answer_id
          );

          poll.save().then(poll => {
            return res.json({ success: true, answer });
          });
        });
      } else {
        res.status(404).json({ error: "No found" });
      }
    });
  }
);

router.post(
  "/:answer_id/vote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Answer.findById(req.params.answer_id).then(answer => {
      console.log(answer);
      if (answer) {
        if (
          answer.voted.length &&
          answer.voted.filter(user => user.toString() === req.user.id).length >
            0
        ) {
          return res
            .status(400)
            .json({ alreadyvoted: "Already voted" });
        }
        answer.voted.push(req.user.id);
        answer.save().then(answer => res.json(answer));
      } else {
        res.status(404).json({ error: "No found" });
      }
    });
  }
);

module.exports = router;
